<script setup lang="ts">
import MessageInput from "@/components/conversation/MessageInput.vue";
import { useConversation } from "@/composables/useConversation";
import ImageUpload from "@/components/ImageUpload.vue";
import HiPaperAirplane from "~/components/ui/icons/HiPaperAirplane.vue";

const { conversationId } = useConversation();

const message = ref("");

const onSubmit = async () => {
  if (!message.value.length) {
    return;
  }

  sendMessage({
    message: message.value,
    conversationId: conversationId.value,
  });
  message.value = "";
};

const onImageUpload = (img: string) => {
  sendMessage({
    conversationId: conversationId.value,
    image: img,
  });
};

const sendMessage = async (body: object) => {
  let response: unknown;

  response = await $fetch("/api/messages", {
    method: "POST",
    body,
  });
};
</script>

<template>
  <div
    class="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full"
  >
    <ImageUpload @change="onImageUpload" />

    <form
      @submit.prevent="onSubmit"
      class="flex items-center gap-2 lg:gap-4 w-full"
    >
      <MessageInput
        id="message"
        v-model="message"
        required
        placeholder="Write a message"
      />
      <button
        type="submit"
        class="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
      >
        <HiPaperAirplane class="text-white" />
      </button>
    </form>
  </div>
</template>
