<script setup lang="ts">
import type { Conversation, User } from "@prisma/client";
import Avatar from "@/components/Avatar.vue";
import AvatarGroup from "@/components/AvatarGroup.vue";
import HiChevronLeft from "@/components/ui/icons/HiChevronLeft.vue";
import HiEllipsisHorizontal from "@/components/ui/icons/HiEllipsisHorizontal.vue";
import ProfileDrawer from "./ProfileDrawer.vue";
import { useActiveListStore } from "@/stores/useActiveListStore";
import { useOtherUser } from "@/composables/useOtherUser";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}
const { conversation } = defineProps<HeaderProps>();

const drawerOpen = ref(false);

const { data: session } = useAuth();

const otherUser = useOtherUser(conversation, session);

const { members } = storeToRefs(useActiveListStore());

const isActive = members.value.indexOf(otherUser?.email) !== -1;

const statusText = computed(() => {
  if (conversation.isGroup) {
    return `${conversation.users.length} members`;
  }

  return isActive ? "Active" : "Offline";
});
</script>

<template>
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

      <AvatarGroup :users="conversation.users" v-if="conversation.isGroup" />

      <Avatar :user="otherUser" v-else />

      <div class="flex flex-col">
        <div>{{ conversation.name || otherUser.name }}</div>
        <div class="text-sm font-light text-neutral-500">
          {{ statusText }}
        </div>
      </div>
    </div>

    <HiEllipsisHorizontal
      size="32"
      @click="drawerOpen = true"
      class="text-sky-500 cursor-pointer hover:text-sky-600 transition"
    />
  </div>
</template>
