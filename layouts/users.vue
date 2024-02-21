<script setup lang="ts">
import clsx from "clsx";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import UsersList from "@/components/users/UsersList.vue";
import ConversationSkeleton from "@/components/conversations/ConversationSkeleton.vue";

const isOpen = true;

const { data: users, pending } = useLazyAsyncData(
  "users",
  () => $fetch("/api/users"),
  {
    server: false,
  }
);
</script>

<template>
  <ActiveStatus />
  <Sidebar>
    <UsersList :items="users" v-if="users" />
    <ConversationSkeleton v-if="pending && !users" />
    <div :class="clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')">
      <slot />
    </div>
  </Sidebar>
</template>
