<script setup lang="ts">
import UserBox from "./UserBox.vue";
import { type User } from "@prisma/client";
import ConversationSkeleton from "@/components/conversations/ConversationSkeleton.vue";

interface UserListProps {
  items: User[];
  pending: boolean;
}

const { items, pending } = defineProps<UserListProps>();
</script>

<template>
  <aside
    class="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0"
  >
    <div class="px-5 space-y-1">
      <div class="flex-col">
        <div class="text-2xl font-bold text-neutral-800 py-4">People</div>
      </div>
      <ConversationSkeleton v-if="pending && !items" />
      <template v-else>
        <UserBox v-for="item in items" :key="item.id" :data="item" />
      </template>
    </div>
  </aside>
</template>
