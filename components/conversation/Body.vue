<script setup lang="ts">
import type { FullMessageType } from "@/types";
import MessageBox from "@/components/conversation/MessageBox.vue";

const { pusherClient } = useNuxtApp();

interface BodyProps {
  messages: FullMessageType[];
}

const { messages } = defineProps<BodyProps>();

const bottomRef = ref<null | HTMLDivElement>(null);

const getConversationId = () => {
  return useRoute()?.params.conversationId;
};

const setSeen = async () => {
  $fetch(`/api/conversations/${getConversationId()}/seen`, {
    method: "POST",
  });
};

const newMessageHandler = async () => {
  setSeen();
  setTimeout(() => {
    bottomRef.value?.scrollIntoView();
  }, 200);
};

onMounted(() => {
  setSeen();

  pusherClient.subscribe(getConversationId());

  pusherClient.bind("message:new", newMessageHandler);

  bottomRef.value?.scrollIntoView();
});

onUnmounted(() => {
  pusherClient.unsubscribe(getConversationId());
  pusherClient.unbind("messages:new", newMessageHandler);
});
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
