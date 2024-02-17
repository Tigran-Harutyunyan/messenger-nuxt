<script setup lang="ts">
import { type FullMessageType } from "@/types";
import { bindWithChunking } from "@/lib/utils";
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

const bottomRef = ref(null);

const { conversationId } = useConversation();

const setSeen = async () => {
  $fetch(`/api/conversations/${conversationId.value}/seen`, {
    method: "POST",
  });
};

const messageHandler = async (message: FullMessageType) => {
  setSeen();

  if (
    messages.value &&
    !messages.value.find((item) => item.id === message.id)
  ) {
    messages.value.push(message);
  } else {
    messages.value = [message];
  }

  bottomRef.value?.scrollIntoView();
};

const updateMessageHandler = (newMessage: FullMessageType) => {
  messages.value.map((currentMessage) => {
    if (currentMessage.id === newMessage.id) {
      return newMessage;
    }

    return currentMessage;
  });
};

onMounted(() => {
  setSeen();

  const channel = pusherClient.subscribe(conversationId.value);
  bindWithChunking(channel, "message:new", messageHandler);
  bindWithChunking(channel, "message:update", updateMessageHandler);

  bottomRef.value?.scrollIntoView();
});

onUnmounted(() => {
  pusherClient.unsubscribe(conversationId.value);
  pusherClient.unbind("messages:new", messageHandler);
  pusherClient.unbind("message:update", updateMessageHandler);
});

watch(
  () => newMessagge.value,
  (message) => {
    if (
      conversationId.value === message?.conversationId &&
      !messages.value.find((item) => item.id === message.id)
    ) {
      messages.value.push(message);
      bottomRef.value?.scrollIntoView();
    }
  }
);
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
