<script setup lang="ts">
import DesktopItem from "@/components/sidebar/DesktopItem.vue";
import Avatar from "@/components/Avatar.vue";
import { useRoutes } from "@/composables/useRoutes";
import SettingsModal from "@/components/sidebar/SettingsModal.vue";
import { useMainStore } from "@/stores/main";
const { toggleSettingsModal } = useMainStore();

const { showSettingsModal } = storeToRefs(useMainStore());

const { signOut } = useAuth();

import { type User } from "@prisma/client";

interface DesktopSidebarProps {
  currentUser: User;
}
const routes = useRoutes();

const { currentUser } = defineProps<DesktopSidebarProps>();

const onClick = (href: string) => {
  if (href === "#") {
    signOut();
  }
};
</script>

<template>
  <SettingsModal
    :currentUser="currentUser"
    :isOpen="showSettingsModal"
    @close="toggleSettingsModal(false)"
  />
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
        @click="toggleSettingsModal(true)"
        class="cursor-pointer hover:opacity-75 transition"
      >
        <ClientOnly>
          <n-tooltip placement="top-start" trigger="hover">
            <template #trigger>
              <Avatar :user="currentUser" v-if="currentUser" />
            </template>
            <span v-if="currentUser"> Update profile</span>
          </n-tooltip>
        </ClientOnly>
      </div>
    </nav>
  </div>
</template>
