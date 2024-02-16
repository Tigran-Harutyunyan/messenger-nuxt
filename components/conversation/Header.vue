<script setup lang="ts">
import type { Conversation, User } from "@prisma/client";
import Avatar from "@/components/Avatar.vue";
import AvatarGroup from "@/components/AvatarGroup.vue";
import HiChevronLeft from "@/components/ui/icons/HiChevronLeft.vue";
import HiEllipsisHorizontal from "@/components/ui/icons/HiEllipsisHorizontal.vue";
import ProfileDrawer from "./ProfileDrawer.vue";
import { useActiveListStore } from "@/stores/useActiveListStore";
import { useOtherUser } from "@/composables/useOtherUser";
import ConfirmModal from "./ConfirmModal.vue";
import TrashIcon from "@/components/ui/icons/TrashIcon.vue";
import InfoIcon from "@/components/ui/icons/InfoIcon.vue";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}
const { conversation } = defineProps<HeaderProps>();

const drawerOpen = ref(false);

const isConfirmOpen = ref(false);

const { data: session } = useAuth();

const otherUser = useOtherUser(conversation, session);

const { members } = storeToRefs(useActiveListStore());

const isActive = computed(() => {
  return members.value.indexOf(otherUser.value?.email) !== -1;
});

const statusText = computed(() => {
  if (conversation?.isGroup) {
    return `${conversation?.users.length} members`;
  }

  return isActive.value ? "Active" : "Offline";
});

const renderIcon = (icon: Component) => {
  return () => {
    return h(icon, null, {
      default: () => h(icon),
    });
  };
};
const options = [
  {
    label: "Info",
    key: "info",
    icon: renderIcon(InfoIcon),
  },
  {
    label: "Delete",
    key: "delete",
    icon: renderIcon(TrashIcon),
  },
];

const handleSelect = (action: string) => {
  if (action === "delete") {
    isConfirmOpen.value = true;
  }

  if (action === "info") {
    drawerOpen.value = true;
  }
};
</script>

<template>
  <ConfirmModal :isOpen="isConfirmOpen" @closeConfirm="isConfirmOpen = false" />
  <ProfileDrawer
    :data="conversation"
    :isOpen="drawerOpen"
    @close="drawerOpen = false"
  />
  <div
    class="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm"
  >
    <div class="flex gap-3 items-center">
      <NuxtLink
        to="/conversations"
        class="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
      >
        <HiChevronLeft size="32" />
      </NuxtLink>

      <AvatarGroup :users="conversation?.users" v-if="conversation.isGroup" />

      <Avatar :user="otherUser" v-else />

      <div class="flex flex-col">
        <div>{{ conversation.name || otherUser.name }}</div>
        <div class="text-sm font-light text-neutral-500">
          {{ statusText }}
        </div>
      </div>
    </div>
    <n-dropdown
      :options="options"
      placement="bottom-end"
      @select="handleSelect"
    >
      <HiEllipsisHorizontal
        size="32"
        class="text-sky-500 cursor-pointer hover:text-sky-600 transition ellipsoid"
      />
    </n-dropdown>
  </div>
</template>
