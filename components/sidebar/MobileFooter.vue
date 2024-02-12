<script setup lang="ts">
import MobileItem from "./MobileItem.vue";
import { useConversation } from "@/composables/useConversation";
const { signOut } = useAuth();
const { isOpen } = useConversation();

const routes = useRoutes();

const onClick = (href: string) => {
  if (href === "#") {
    signOut();
  }
};
</script>

<template>
  <div
    v-if="!isOpen"
    class="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden"
  >
    <MobileItem
      v-for="route in routes"
      :key="route.href"
      :href="route.href"
      :active="route.active"
      :icon="route.icon"
      @click="onClick"
    />
  </div>
</template>
