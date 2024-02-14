<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "conversations" });
import type { Conversation, Message, User } from "@prisma/client";
import type { FullConversationType } from "@/types";

import Header from "@/components/conversation/Header.vue";
import Body from "@/components/conversation/Body.vue";
import Form from "@/components/conversation/Form.vue";

interface IParams {
  conversationId: string;
}

const conversation = ref<FullConversationType>();

const messages = ref<Message[]>([]);

const loadingConversation = ref(true);

const loadingMessages = ref(true);

const dataIsFetched = computed(() => {
  return !loadingConversation.value && !loadingMessages.value;
});
const route = useRoute();

const getConversation = async () => {
  let res: unknown;

  res = await $fetch(
    `/api/conversation?conversationId=${route.params?.conversationId}`
  );

  if (res) {
    conversation.value = res as FullConversationType;
  }

  loadingConversation.value = false;
};

const getMessages = async () => {
  let res: unknown;
  res = await $fetch(
    `/api/messages?conversationId=${route.params?.conversationId}`
  );

  if (res) {
    messages.value = res as Message[];
  }

  loadingMessages.value = false;
};

getConversation();
getMessages();
</script>

<template>
  <div class="h-full" v-if="!conversation && dataIsFetched">
    <div class="h-full flex flex-col">
      <EmptyState />
    </div>
  </div>

  <div class="h-full" v-if="conversation && dataIsFetched">
    <div class="h-full flex flex-col">
      <Header :conversation="conversation" />
      <Body :initialMessages="messages" />
      <Form />
    </div>
  </div>
</template>
