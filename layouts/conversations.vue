<script setup lang="ts">
import clsx from "clsx";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import ConversationList from "@/components/conversations/ConversationList.vue";
import MdOutlineGroupAdd from "@/components/ui/icons/MdOutlineGroupAdd.vue";
import GroupChatModal from "@/components/modals/GroupChatModal.vue";
import { type FullConversationType } from "../types";
import { bindWithChunking } from "@/lib/utils";

const { data: session } = useAuth();

const { pusherClient } = useNuxtApp();

const isModalOpen = ref(false);

const isOpen = true;

const router = useRouter();

const { data: conversations, pending } = useLazyAsyncData(
  "conversations",
  () => $fetch("/api/conversations"),
  { server: false }
);

const { data: users } = useLazyAsyncData("users", () => $fetch("/api/users"), {
  server: false,
});

const items = ref<FullConversationType[]>(conversations);

provide("conversations", items);

const pusherKey = computed(() => {
  return session?.value?.user?.email;
});

const swapArray = (
  array: FullConversationType[],
  indexA: number,
  indexB: number
) => {
  const tmp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = tmp;
  return array;
};

const updateHandler = async (conversation: FullConversationType) => {
  let updateIndex = 0;
  items.value = items.value.map((currentConversation, curreentIndex) => {
    if (currentConversation.id === conversation.id) {
      updateIndex = curreentIndex;

      if (!currentConversation.messages) {
        currentConversation.messages = [];
      }

      let foundIndex;

      currentConversation.messages.forEach((msg, index) => {
        if (msg.id === conversation.messages[0].id) {
          foundIndex = index;
        }
      });

      if (foundIndex) {
        currentConversation.messages[foundIndex] = conversation.messages[0];
      } else {
        currentConversation.messages = [
          ...currentConversation.messages,
          ...conversation.messages,
        ];
      }
    }
    return currentConversation;
  });
};

const newHandler = async (conversation: FullConversationType) => {
  if (!items.value.find((item) => item.id === conversation.id)) {
    items.value.unshift(conversation);
  }
};

const removeHandler = (conversationId: string) => {
  items.value = [...items.value.filter((conv) => conv.id !== conversationId)];
  router.push("/conversations");
};

onMounted(() => {
  if (!pusherKey.value) {
    return;
  }

  const channel = pusherClient.subscribe(pusherKey.value);

  bindWithChunking(channel, "conversation:update", updateHandler);
  bindWithChunking(channel, "conversation:new", newHandler);
  pusherClient.bind("conversation:remove", removeHandler);
});

onBeforeUnmount(() => {
  pusherClient.unsubscribe(pusherKey.value);
  pusherClient.unbind("conversation:new", newHandler);
  pusherClient.unbind("conversation:remove", removeHandler);
  pusherClient.unbind("conversation:update", updateHandler);
});
</script>

<template>
  <ActiveStatus />
  <GroupChatModal
    v-if="users"
    :users="users"
    :isOpen="isModalOpen"
    @close="isModalOpen = false"
  />

  <Sidebar>
    <ConversationList :items="items" v-if="conversations">
      <div
        @click="isModalOpen = true"
        class="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
      >
        <MdOutlineGroupAdd size="20" />
      </div>
    </ConversationList>

    <div
      :class="clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')"
      v-if="!pending"
    >
      <slot />
    </div>
  </Sidebar>
</template>
