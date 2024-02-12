<script setup lang="ts">
import DesktopSidebar from "./DesktopSidebar.vue";
import MobileFooter from "./MobileFooter.vue";
</script>

<template>
  <div class="h-full">
    <DesktopSidebar />
    <MobileFooter />
    <main class="lg:pl-20 h-full">
      <slot />
    </main>
  </div>
</template>
