<script setup lang="ts">
import type { FullMessageType, eventMessage } from "@/types";
import MessageBox from "@/components/conversation/MessageBox.vue";
import { useConversation } from "@/composables/useConversation";
import { useMainStore } from "@/stores/main";

const { newMessagge } = storeToRefs(useMainStore());

const { pusherClient } = useNuxtApp();

interface BodyProps {
  initialMessages: FullMessageType[];
}

const { initialMessages } = defineProps<BodyProps>();

const messages = ref(initialMessages);

const bottomRef = ref<null | HTMLDivElement>(null);

const { conversationId } = useConversation();

const setSeen = async () => {
  $fetch(`/api/conversations/${conversationId.value}/seen`, {
    method: "POST",
  });
};

const transformMessage = (payload: eventMessage) => {
  const {
    i,
    b: body,
    c: createdAt,
    si: senderId,
    se: { n: name, e: email, im: image },
  } = payload;

  return {
    id: i,
    body,
    createdAt,
    senderId,
    conversationId: conversationId.value,
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
  };
};

const newMessageHandler = async (payload: eventMessage) => {
  //setSeen();
  // const message: FullMessageType = transformMessage(payload);
  // if (!messages.value.find((item) => item.id === message.id)) {
  //   messages.value.push(message);
  // }
  bottomRef.value?.scrollIntoView();
};

const updateMessageHandler = (payload: eventMessage) => {
  const newMg: FullMessageType = transformMessage(payload);

  // messages.value.map((currentMessage) => {
  //   if (currentMessage.id === newMg.id) {
  //     return newMg;
  //   }

  //   return currentMessage;
  // });
};

// watch(
//   () => newMessagge?.value,
//   () => {
//     bottomRef.value?.scrollIntoView();
//   }
// );

onMounted(() => {
  setSeen();

  pusherClient.subscribe(conversationId.value);
  pusherClient.bind("message:new", newMessageHandler);
  pusherClient.bind("message:update", updateMessageHandler);

  bottomRef.value?.scrollIntoView();
});

onUnmounted(() => {
  pusherClient.unsubscribe(conversationId.value);
  pusherClient.unbind("messages:new", newMessageHandler);
  pusherClient.unbind("message:update", updateMessageHandler);
});

// watch(
//   () => newMessagge?.value,
//   (message) => {
//     if (
//       conversationId.value === message?.conversationId &&
//       !messages.value.find((item) => item.id === message.id)
//     ) {
//       messages.value.push(message);
//       bottomRef.value?.scrollIntoView();
//     }
//   }
// );
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <MessageBox
      v-for="(message, i) in messages"
      :isLast="i === messages.length - 1"
      :key="message.id"
      :data="message"
    />
    <div class="pt-24" ref="bottomRef"></div>
  </div>
</template>
