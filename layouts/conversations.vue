<script setup lang="ts">
import clsx from "clsx";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import ConversationList from "@/components/conversations/ConversationList.vue";
import MdOutlineGroupAdd from "@/components/ui/icons/MdOutlineGroupAdd.vue";
import GroupChatModal from "@/components/modals/GroupChatModal.vue";
import { type FullConversationType } from "../types";

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

const updateHandler = (conversation: FullConversationType) => {
  items.value.forEach(
    (currentConversation: FullConversationType, index, arr) => {
      if (currentConversation.id === conversation.id) {
        const currentMessages = arr[index].messages || [];
        const newMessage = conversation?.messages[0];
        const messageExists = currentMessages.find(
          (msg) => msg.id === conversation.id
        );

        if (!newMessage.sender && !messageExists) {
          const message = currentMessages.find(
            (msg) => msg.senderId === newMessage.senderId
          );
          conversation.messages[0].sender = message?.sender;
          arr[index].messages = [
            ...arr[index].messages,
            ...conversation?.messages,
          ];
        }
      }
    }
  );
};

const newHandler = (conversation: FullConversationType) => {
  if (!items.value.find((item) => item.id === conversation.id)) {
    items.value.push(conversation);
  }
};

const removeHandler = (conversation: FullConversationType) => {
  items.value = [
    ...items.value.filter((convo) => convo.id !== conversation.id),
  ];
  router.push("/conversations");
};

onMounted(() => {
  if (!pusherKey.value) {
    return;
  }

  pusherClient.subscribe(pusherKey.value);

  pusherClient.bind("conversation:update", updateHandler);
  pusherClient.bind("conversation:new", newHandler);
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
