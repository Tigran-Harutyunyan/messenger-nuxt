<script setup lang="ts">
import DesktopSidebar from "./DesktopSidebar.vue";
import MobileFooter from "./MobileFooter.vue";
import { type User } from "@prisma/client";

const currentUser = ref();

const res = await $fetch("/api/user", {
  method: "GET",
});
if (res?.id) {
  currentUser.value = res;
}

const updateUser = (user: User) => {
  currentUser.value = user;
};

provide("user", {
  updateUser,
});
</script>

<template>
  <div class="h-full">
    <DesktopSidebar :currentUser="currentUser" />
    <MobileFooter />
    <main class="lg:pl-20 h-full">
      <slot />
    </main>
  </div>
</template>
