<script setup lang="ts">
import UserBox from "./UserBox.vue";
import { type User } from "@prisma/client";

interface UserListProps {
  items: User[];
}

const { items } = defineProps<UserListProps>();
</script>

<template>
  <aside
    class="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0"
  >
    <div class="px-5">
      <div class="flex-col">
        <div class="text-2xl font-bold text-neutral-800 py-4">People</div>
      </div>
      <UserBox v-for="item in items" :key="item.id" :data="item" />
    </div>
  </aside>
</template>
