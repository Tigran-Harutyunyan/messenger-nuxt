<script setup lang="ts">
import DesktopItem from "@/components/sidebar/DesktopItem.vue";
import Avatar from "@/components/Avatar.vue";
import { useRoutes } from "@/composables/useRoutes";

const { signOut } = useAuth();
// import SettingsModal from "./SettingsModal";

import { type User } from "@prisma/client";

interface DesktopSidebarProps {
  currentUser: User;
}
const routes = useRoutes();

const isOpen = ref(false);

const { currentUser } = defineProps<DesktopSidebarProps>();

const onClick = (href: string) => {
  if (href === "#") {
    signOut();
  }
};
</script>

<template>
  <div
    class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between"
  >
    <nav class="mt-4 flex flex-col justify-between">
      <ul role="list" class="flex flex-col items-center space-y-1">
        <DesktopItem
          v-for="item in routes"
          :key="item.label"
          :href="item.href"
          :label="item.label"
          :icon="item.icon"
          :active="item.active"
          @click="onClick"
        />
      </ul>
    </nav>
    <nav class="mt-4 flex flex-col justify-between items-center">
      <div
        @click="isOpen = true"
        class="cursor-pointer hover:opacity-75 transition"
      >
        <Avatar :user="currentUser" />
      </div>
    </nav>
  </div>
</template>
