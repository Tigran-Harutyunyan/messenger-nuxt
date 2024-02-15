<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "conversations" });

useHead({
  title: "Conversation | Messenger",
});

import Header from "@/components/conversation/Header.vue";
import Body from "@/components/conversation/Body.vue";
import Form from "@/components/conversation/Form.vue";

interface IParams {
  conversationId: string;
}

const loadingConversation = ref(true);

const loadingMessages = ref(true);

const dataIsFetched = computed(() => {
  return !loadingConversation.value && !loadingMessages.value;
});
const route = useRoute();

const { data: conversation } = useLazyAsyncData(
  "conversation",
  () =>
    $fetch(`/api/conversation?conversationId=${route.params?.conversationId}`),
  { server: false }
);

const { data: messages } = useLazyAsyncData(
  "messages",
  () => $fetch(`/api/messages?conversationId=${route.params?.conversationId}`),
  { server: false }
);
</script>

<template>
  <div class="h-screen">
    <div class="h-screen flex flex-col" v-if="conversation && messages">
      <Header :conversation="conversation" />
      <Body :initialMessages="messages" />
      <Form />
    </div>
  </div>
</template>
