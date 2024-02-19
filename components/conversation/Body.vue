<script setup lang="ts">
import type { FullMessageType, eventMessage } from "@/types";
import MessageBox from "@/components/conversation/MessageBox.vue";
import { useConversation } from "@/composables/useConversation";

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

const newMessageHandler = async (payload: eventMessage) => {
  setSeen();
  bottomRef.value?.scrollIntoView();
};

onMounted(() => {
  setSeen();

  pusherClient.subscribe(conversationId.value);
  pusherClient.bind("message:new", newMessageHandler);

  bottomRef.value?.scrollIntoView();
});

onUnmounted(() => {
  pusherClient.unsubscribe(conversationId.value);
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
