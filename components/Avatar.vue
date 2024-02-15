<script setup lang="ts">
import { type User } from "@prisma/client";
import { useActiveListStore } from "@/stores/useActiveListStore";

const { members } = storeToRefs(useActiveListStore());

interface AvatarProps {
  user?: User;
}

const { user } = defineProps<AvatarProps>();

const isActive = computed(() => {
  return members.value.indexOf(user?.email!) !== -1;
});
</script>

<template>
  <div class="relative">
    <div
      class="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11"
    >
      <NuxtImg
        fill
        :src="user?.image || '/images/placeholder.jpg'"
        alt="Avatar"
      />
    </div>

    <span
      v-if="isActive"
      class="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3"
    />
  </div>
</template>
