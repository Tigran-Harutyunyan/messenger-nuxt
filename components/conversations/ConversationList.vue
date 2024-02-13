<script setup lang="ts">
import clsx from "clsx";
import { type User } from "@prisma/client";
import { type FullConversationType } from "../../types";
import { find, uniq } from "lodash";
import ConversationBox from "./ConversationBox.vue";
import MdOutlineGroupAdd from "@/components/ui/icons/MdOutlineGroupAdd.vue";
import useConversation from "@/composables/useConversation";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
}

const { initialItems, users, title } = defineProps<ConversationListProps>();

const { data: session } = useAuth();

const { conversationId, isOpen } = useConversation();

const items = ref(initialItems);

const setIsModalOpen = (state: boolean) => {};
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
    <div class="px-5">
      <div class="flex justify-between mb-4 pt-4">
        <div class="text-2xl font-bold text-neutral-800">Messages</div>
        <div
          @click="setIsModalOpen(true)"
          class="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
        >
          <MdOutlineGroupAdd size="20" />
        </div>
      </div>

      <ConversationBox
        v-for="item in items"
        :key="item.id"
        :data="item"
        :selected="conversationId === item.id"
      />
    </div>
  </aside>
</template>
