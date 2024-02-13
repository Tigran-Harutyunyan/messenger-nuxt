<script setup lang="ts">
import clsx from "clsx";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import UsersList from "@/components/users/UsersList.vue";

import { type User } from "@prisma/client";

const isOpen = true;

// const conversations = []; //await getConversations();
const users = ref<User[]>([]);

const getUsers = async () => {
  let res: unknown;
  res = await $fetch("/api/users", {
    method: "get",
  });

  if (res && Array.isArray(res)) {
    users.value = res as User[];
  }
};
getUsers();
</script>

<template>
  <Sidebar>
    <UsersList :items="users" />
    <div :class="clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')">
      <slot />
    </div>
  </Sidebar>
</template>
