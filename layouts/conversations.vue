<script setup lang="ts">
import clsx from "clsx";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import ConversationList from "@/components/conversations/ConversationList.vue";
import { type User } from "@prisma/client";
import { type FullConversationType } from "@/types";

const isOpen = true;
const users = ref<User[]>([]);

const conversations = ref<FullConversationType[]>([]);

const loadingConversations = ref(true);
const loadingUsers = ref(true);

const getConversations = async () => {
  let res: unknown;
  res = await $fetch("/api/conversations");

  if (res && Array.isArray(res)) {
    conversations.value = res as FullConversationType[];
  }

  loadingConversations.value = false;
};

const getUsers = async () => {
  let res: unknown;
  res = await $fetch("/api/users");

  if (res && Array.isArray(res)) {
    users.value = res as User[];
  }

  loadingUsers.value = false;
};

getConversations();
getUsers();
</script>

<template>
  <Sidebar>
    <ClientOnly>
      <ConversationList
        v-if="!loadingUsers && !loadingConversations"
        :users="users"
        title="Messages"
        :initialItems="conversations"
      />
    </ClientOnly>
    <div :class="clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')">
      <slot />
    </div>
  </Sidebar>
</template>
