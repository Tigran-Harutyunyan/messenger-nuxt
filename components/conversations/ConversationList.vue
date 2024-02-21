<script setup lang="ts">
import clsx from "clsx";
import { type FullConversationType } from "@/types";
import ConversationBox from "./ConversationBox.vue";
import useConversation from "@/composables/useConversation";
import ConversationSkeleton from "@/components/conversations/ConversationSkeleton.vue";

interface ConversationListProps {
  items: FullConversationType[] | null;
  pending: boolean;
}
const { items, pending } = defineProps<ConversationListProps>();

const { conversationId, isOpen } = useConversation();
</script>

<template>
  <aside
    :class="
      clsx(
        `
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `,
        isOpen ? 'hidden' : 'block w-full left-0'
      )
    "
  >
    <div class="px-5 space-y-1">
      <div class="flex justify-between mb-4 pt-4">
        <div class="text-2xl font-bold text-neutral-800">Messages</div>
        <slot />
      </div>
      <ConversationSkeleton v-if="pending && !items" />

      <template v-else>
        <ConversationBox
          v-for="item in items"
          :key="item.id"
          :data="item"
          :selected="conversationId === item.id"
        />
      </template>
    </div>
  </aside>
</template>
