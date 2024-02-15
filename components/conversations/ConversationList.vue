<script setup lang="ts">
import clsx from "clsx";
import { type FullConversationType } from "../../types";
import { find } from "lodash";
import ConversationBox from "./ConversationBox.vue";
import useConversation from "@/composables/useConversation";

const { pusherClient } = useNuxtApp();

interface ConversationListProps {
  initialItems: FullConversationType[];
  title?: string;
}

const { initialItems } = defineProps<ConversationListProps>();

const { data: session } = useAuth();

const { conversationId, isOpen } = useConversation();

const items = ref(initialItems);

const pusherKey = computed(() => {
  return session?.value?.user?.email;
});

const updateHandler = (conversation: FullConversationType) => {
  items.value = items.value.map((currentConversation) => {
    if (currentConversation.id === conversation.id) {
      return {
        ...currentConversation,
        messages: conversation.messages,
      };
    }

    return currentConversation;
  });
};

const newHandler = (conversation: FullConversationType) => {
  if (!find(items.value, { id: conversation.id })) {
    items.value.push(conversation);
  }
};

const removeHandler = (conversation: FullConversationType) => {
  items.value = [
    ...items.value.filter((convo) => convo.id !== conversation.id),
  ];
};

onMounted(() => {
  if (!pusherKey.value) {
    return;
  }

  pusherClient.subscribe(pusherKey.value);

  pusherClient.bind("conversation:update", updateHandler);
  pusherClient.bind("conversation:new", newHandler);
  pusherClient.bind("conversation:remove", removeHandler);
});

onUnmounted(() => {
  pusherClient.unsubscribe(pusherKey.value);
  pusherClient.unbind("conversation:new", newHandler);
  pusherClient.unbind("conversation:remove", removeHandler);
});
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
        <slot />
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
