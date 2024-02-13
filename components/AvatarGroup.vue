<script setup lang="ts">
import type { User } from "@prisma/client";

interface AvatarGroupProps {
  users?: User[];
}
const { users } = defineProps<AvatarGroupProps>();

const slicedUsers = users?.slice(0, 3);

const positionMap = {
  0: "top-0 left-[12px]",
  1: "bottom-0",
  2: "bottom-0 right-0",
};
</script>

<template>
  <div class="relative h-11 w-11">
    <div
      v-for="(user, index) in slicedUsers"
      :key="user.id"
      :class="`
            absolute
            inline-block 
            rounded-full 
            overflow-hidden
            h-[21px]
            w-[21px]
            ${positionMap[index as keyof typeof positionMap]}
          `"
    >
      <NuxtImg
        fill
        :src="user?.image || '/images/placeholder.jpg'"
        alt="Avatar"
      />
    </div>
  </div>
</template>
