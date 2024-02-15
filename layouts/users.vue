<script setup lang="ts">
import clsx from "clsx";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import UsersList from "@/components/users/UsersList.vue";
const isOpen = true;

const { data: users } = useLazyAsyncData("users", () => $fetch("/api/users"), {
  server: false,
});
</script>

<template>
  <Sidebar>
    <UsersList :items="users" />
    <div :class="clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')">
      <slot />
    </div>
  </Sidebar>
</template>
