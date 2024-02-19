<script setup lang="ts">
import Header from "@/components/conversation/Header.vue";
import Body from "@/components/conversation/Body.vue";
import Form from "@/components/conversation/Form.vue";

import { useConversation } from "@/composables/useConversation";

const { conversationId } = useConversation();

definePageMeta({ middleware: "auth", layout: "conversations" });

useHead({
  title: "Conversation | Messenger",
});

const conversations = inject("conversations");

const conversation = computed(() => {
  if (conversations?.value && Array.isArray(conversations.value)) {
    return conversations.value?.find(
      (item) => item.id === conversationId.value
    );
  }
});
</script>

<template>
  <div class="h-full flex flex-col" v-if="conversation">
    <Header :conversation="conversation" />
    <Body :messages="conversation.messages" />
    <Form />
  </div>
</template>
