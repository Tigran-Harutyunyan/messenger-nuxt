<script setup lang="ts">
import { type FullMessageType } from "@/types";
import { find } from "lodash";
import MessageBox from "@/components/conversation/MessageBox.vue";
import { useConversation } from "@/composables/useConversation";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const { initialMessages } = defineProps<BodyProps>();

const messages = ref(initialMessages);

const bottomRef = ref(null);

const { conversationId } = useConversation();

onMounted(() => {
  const res = $fetch(`/api/conversations/${conversationId.value}/seen`, {
    method: "POST",
  });
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
