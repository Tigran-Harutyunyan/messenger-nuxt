<script setup lang="ts">
import clsx from "clsx";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import ConversationList from "@/components/conversations/ConversationList.vue";
import MdOutlineGroupAdd from "@/components/ui/icons/MdOutlineGroupAdd.vue";
import GroupChatModal from "@/components/modals/GroupChatModal.vue";
import { useMainStore } from "@/stores/main";
import {
  getTransformedNewConversation,
  getTransformedConversation,
} from "@/lib/utils";
import ConversationSkeleton from "@/components/conversations/ConversationSkeleton.vue";
import type {
  FullConversationType,
  eventConversation,
  eventNewConversation,
} from "@/types";

const { currentUser } = storeToRefs(useMainStore());

const { data: session } = useAuth();

const { pusherClient } = useNuxtApp();

const isModalOpen = ref(false);

const isOpen = true;

const router = useRouter();

const { data: items, pending } = useLazyAsyncData(
  "items",
  () => $fetch("/api/conversations"),
  { server: false }
);

const { data: users } = useLazyAsyncData("users", () => $fetch("/api/users"), {
  server: false,
});

const conversations = ref<FullConversationType[]>(items);

const pusherKey = computed(() => {
  return session?.value?.user?.email;
});

const updateHandler = async (payload: eventConversation) => {
  const conversation = getTransformedConversation(payload);

  conversations.value.forEach((currentConversation) => {
    if (currentConversation.id === conversation.id) {
      if (!currentConversation.messages) {
        currentConversation.messages = [];
      }

      let foundIndex = -1;

      currentConversation.messages.forEach((msg, index) => {
        if (msg.id === conversation.message.id) {
          foundIndex = index;
        }
      });

      if (foundIndex !== -1) {
        currentConversation.messages[foundIndex] = conversation.message;
      } else {
        currentConversation.messages.push(conversation.message);
      }
    }
  });
};

const newHandler = async (payload: eventNewConversation) => {
  if (!conversations.value) return;

  const conversation = getTransformedNewConversation(
    payload,
    currentUser.value,
    users.value
  );

  if (!conversations.value.find((item) => item.id === conversation.id)) {
    conversations.value.unshift(conversation);
  }
};

const removeHandler = (conversationId: string) => {
  if (!conversations.value) return;

  conversations.value = [
    ...conversations.value.filter((conv) => conv.id !== conversationId),
  ];
  router.push("/conversations");
};

const profileUpdateHandler = ({
  id,
  name,
  image,
}: {
  id: string;
  name: string;
  image: string;
}) => {
  if (!conversations.value) return;

  conversations.value.forEach((conversation) => {
    conversation.users.forEach((user) => {
      if (user.id === id) {
        user.image = image + "?" + new Date().valueOf();
        user.name = name;
      }
    });
    conversation.messages.forEach((msg) => {
      msg.sender.image = "";
      if (msg.sender && msg.sender.id === id) {
        msg.sender.image = image + "?" + new Date().valueOf();
        msg.sender.name = name;
      }
    });
  });
};

onMounted(() => {
  if (!pusherKey.value) {
    return;
  }

  pusherClient.subscribe(pusherKey.value);
  pusherClient.bind("conversation:new", newHandler);
  pusherClient.bind("conversation:remove", removeHandler);
  pusherClient.bind("update:profile", profileUpdateHandler);
  pusherClient.bind("conversation:update", updateHandler);
});

onBeforeUnmount(() => {
  pusherClient.unsubscribe(pusherKey.value);
  pusherClient.unbind("conversation:new", newHandler);
  pusherClient.unbind("conversation:remove", removeHandler);
  pusherClient.unbind("conversation:update", updateHandler);
  pusherClient.unbind("update:profile", profileUpdateHandler);
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
      <n-tooltip placement="bottom-end" trigger="hover" :show-arrow="false">
        <template #trigger>
          <div
            @click="isModalOpen = true"
            class="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
          >
            <MdOutlineGroupAdd size="20" />
          </div>
        </template>
        <span>Create a group chat </span>
      </n-tooltip>
    </ConversationList>

    <ConversationSkeleton v-if="pending && !conversations" />

    <div
      :class="clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')"
      v-if="!pending"
    >
      <slot />
    </div>
  </Sidebar>
</template>
