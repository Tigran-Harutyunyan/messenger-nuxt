<script setup lang="ts">
import DesktopSidebar from "./DesktopSidebar.vue";
import MobileFooter from "./MobileFooter.vue";

const currentUser = ref();

const res = await $fetch("/api/user", {
  method: "GET",
});
if (res) {
  currentUser.value = res;
}
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
