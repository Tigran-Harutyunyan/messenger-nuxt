<script setup lang="ts">
import clsx from "clsx";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import ConversationList from "@/components/conversations/ConversationList.vue";
import MdOutlineGroupAdd from "@/components/ui/icons/MdOutlineGroupAdd.vue";
import GroupChatModal from "@/components/modals/GroupChatModal.vue";
import type {
  FullConversationType,
  eventConversation,
  eventNewConversation,
} from "@/types";

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

const transformConversation = (payload: eventConversation) => {
  const {
    i: cid,
    m: {
      i,
      b: body,
      c: createdAt,
      si: senderId,
      se: { n: name, e: email, im: image },
    },
  } = payload;

  return {
    id: cid,
    message: {
      id: i,
      body,
      createdAt,
      senderId,
      conversationId: cid,
      seen: [],
      seenIds: [],
      image: "",
      sender: {
        id: senderId,
        name,
        email,
        image,
        emailVerified: null,
        seenMessageIds: [],
        conversationIds: [],
        updatedAt: "",
      },
    },
  };
};

const transformNewConversation = (payload: eventNewConversation) => {
  // events come with miimum payload in order to avoid 413 error.need to transform to usable form.
  const { i: id, ig: isGroup, n: name, u: userIds } = payload;

  return {
    id,
    name,
    isGroup,
    users: users.value
      ?.filter((user) => userIds.includes(user.id))
      .map((user) => {
        return {
          id: user.id,
          image: user.image,
          name: user.name,
        };
      }),
  };
};

const updateHandler = async (payload: eventConversation) => {
  const conversation = transformConversation(payload);
  let updateIndex = 0;

  items.value = items.value.map((currentConversation, curreentIndex) => {
    if (currentConversation.id === conversation.id) {
      updateIndex = curreentIndex;

      if (!currentConversation.messages) {
        currentConversation.messages = [];
      }

      let foundIndex;

      currentConversation.messages.forEach((msg, index) => {
        if (msg.id === conversation.message.id) {
          foundIndex = index;
        }
      });

      if (foundIndex) {
        currentConversation.messages[foundIndex] = conversation.message;
      } else {
        currentConversation.messages.push(conversation.message);
      }
    }
    return currentConversation;
  });
};

const newHandler = async (payload: eventNewConversation) => {
  const conversation = transformNewConversation(payload);

  if (!items.value.find((item) => item.id === conversation.id)) {
    items.value.unshift(conversation);
  }
};

const removeHandler = (conversationId: string) => {
  items.value = [...items.value.filter((conv) => conv.id !== conversationId)];
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
  items.value.forEach((conversation) => {
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
      <n-tooltip placement="bottom-center" trigger="hover" :show-arrow="false">
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

    <div
      :class="clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')"
      v-if="!pending"
    >
      <slot />
    </div>
  </Sidebar>
</template>
