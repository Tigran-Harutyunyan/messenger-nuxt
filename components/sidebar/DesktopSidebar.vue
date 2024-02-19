<script setup lang="ts">
import DesktopItem from "@/components/sidebar/DesktopItem.vue";
import Avatar from "@/components/Avatar.vue";
import { useRoutes } from "@/composables/useRoutes";
import SettingsModal from "@/components/sidebar/SettingsModal.vue";
import { useMainStore } from "@/stores/main";
import { type User } from "@prisma/client";

const { toggleSettingsModal, updateUser } = useMainStore();

const { showSettingsModal, currentUser } = storeToRefs(useMainStore());

const { signOut } = useAuth();

const routes = useRoutes();

const onClick = (href: string) => {
  if (href === "#") {
    signOut();
  }
};

const onUpdate = (user: User) => {
  updateUser(user);
};

onMounted(async () => {
  const res: unknown = await $fetch("/api/user", { method: "GET" });

  if (res && typeof res === "object" && "id" in res) {
    updateUser(res as User);
  }
});
</script>

<template>
  <SettingsModal
    v-if="currentUser"
    :currentUser="currentUser"
    :isOpen="showSettingsModal"
    @updated="onUpdate"
    @close="toggleSettingsModal(false)"
  />
  <div
    class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between"
  >
    <nav class="mt-4 flex flex-col justify-between">
      <ul role="list" class="flex flex-col items-center space-y-1">
        <n-tooltip
          placement="right-end"
          trigger="hover"
          :show-arrow="false"
          v-for="item in routes"
        >
          <template #trigger>
            <DesktopItem
              :key="item.label"
              :href="item.href"
              :label="item.label"
              :icon="item.icon"
              :active="item.active"
              @click="onClick"
            />
          </template>
          <span> {{ item.label }}</span>
        </n-tooltip>
      </ul>
    </nav>
    <nav class="mt-4 flex flex-col justify-between items-center">
      <div
        @click="toggleSettingsModal(true)"
        class="cursor-pointer hover:opacity-75 transition"
      >
        <n-tooltip placement="right-end" trigger="hover" :show-arrow="false">
          <template #trigger>
            <Avatar :user="currentUser" v-show="currentUser" />
          </template>
          <span v-if="currentUser"> Update profile</span>
        </n-tooltip>
      </div>
    </nav>
  </div>
</template>
