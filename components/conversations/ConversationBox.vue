<script setup lang="ts">
import clsx from "clsx";
import { format } from "date-fns";
import AvatarGroup from "@/components/AvatarGroup.vue";
import { useOtherUser } from "@/composables/useOtherUser";
import type { User } from "@prisma/client";
import type { FullConversationType } from "@/types";

const { data: session } = useAuth();

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const { data, selected } = defineProps<ConversationBoxProps>();

const router = useRouter();

const otherUser = useOtherUser(data, session);

const handleClick = () => {
  router.push(`/conversations/${data.id}`);
};

const lastMessage = computed(() => {
  const messages = data.messages || [];

  return messages[messages.length - 1];
});

const userEmail = computed(() => session?.value?.user?.email);

const hasSeen = computed(() => {
  if (!lastMessage.value) {
    return false;
  }

  if (!userEmail.value) {
    return false;
  }

  const seenArray = lastMessage.value.seen || [];

  return (
    seenArray.filter((user: User) => user.email === userEmail.value).length !==
    0
  );
});

const lastMessageText = computed(() => {
  if (lastMessage.value?.image) {
    return "Sent an image";
  }

  if (lastMessage.value?.body) {
    return lastMessage.value?.body;
  }

  return "Started a conversation";
});

watch(
  () => data.messages,
  () => {
    console.log(""); // don`t delete console.
  }
);
</script>

<template>
  <div
    @click="handleClick"
    :class="
      clsx(
        `
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )
    "
  >
    <AvatarGroup :users="data.users" v-if="data.isGroup" />

    <Avatar :user="otherUser" v-else />

    <div class="min-w-0 flex-1">
      <div class="focus:outline-none">
        <span class="absolute inset-0" aria-hidden="true" />
        <div class="flex justify-between items-center mb-1">
          <p class="text-md font-medium text-gray-900">
            {{ data?.name || otherUser?.name }}
          </p>

          <p
            v-if="lastMessage?.createdAt"
            class="text-xs text-gray-400 font-light"
          >
            {{ format(new Date(lastMessage.createdAt), "p") }}
          </p>
        </div>
        <p
          :class="
            clsx(
              `
              truncate 
              text-sm
              `,
              hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )
          "
        >
          {{ lastMessageText }}
        </p>
      </div>
    </div>
  </div>
</template>
