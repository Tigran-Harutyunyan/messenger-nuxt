<script setup lang="ts">
import clsx from "clsx";
import Avatar from "@/components/Avatar.vue";
import { format } from "date-fns";
import { type FullMessageType } from "@/types";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const { data, isLast } = defineProps<MessageBoxProps>();

const { data: session } = useAuth();

const isOwn = session?.value?.user?.email === data?.sender?.email;

const seenList = (data.seen || [])
  .filter((user) => user.email !== data?.sender?.email)
  .map((user) => user.name)
  .join(", ");

const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

const avatar = clsx(isOwn && "order-2");

const body = clsx("flex flex-col gap-2", isOwn && "items-end");

const message = clsx(
  "text-sm w-fit overflow-hidden",
  isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
  data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
);
</script>

<template>
  <div :class="container">
    <div :class="avatar">
      <Avatar :user="data.sender" />
    </div>
    <div :class="body">
      <div class="flex items-center gap-1">
        <div class="text-sm text-gray-500">
          {{ data?.sender?.name }}
        </div>
        <div class="text-xs text-gray-400">
          {{ data?.createdAt && format(new Date(data?.createdAt), "p") }}
        </div>
      </div>
      <div :class="message">
        <NuxtImg
          v-if="data.image"
          alt="Image"
          height="288"
          width="288"
          :src="data.image"
          class="object-cover cursor-pointer hover:scale-110 transition translate"
        />

        <div v-else>{{ data.body }}</div>
      </div>

      <div
        v-if="isLast && isOwn && seenList.length > 0"
        class="text-xs font-light text-gray-500"
      >
        {{ `Seen by ${seenList}` }}
      </div>
    </div>
  </div>
</template>
