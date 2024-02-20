<script setup lang="ts">
import clsx from "clsx";
import MessageInput from "@/components/conversation/MessageInput.vue";
import { useConversation } from "@/composables/useConversation";
import ImageUpload from "@/components/ImageUpload.vue";
import HiPaperAirplane from "~/components/ui/icons/HiPaperAirplane.vue";
import { useMainStore } from "@/stores/main";
import { useNotification } from "naive-ui";

const notification = useNotification();

const { showSettingsModal } = storeToRefs(useMainStore());

const { conversationId } = useConversation();

const message = ref("");

const isPosting = ref(false);

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
  if (showSettingsModal.value) return; // workaround
  sendMessage({
    conversationId: conversationId.value,
    image: img,
  });
};

const sendMessage = async (body: object) => {
  try {
    await $fetch("/api/messages", {
      method: "POST",
      body,
    });
  } catch (error) {
    if (error?.message) {
      notification.error({
        content: error.message,
        duration: 2500,
      });
    }
  }
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
        :disabled="isPosting"
        :class="
          clsx(
            'rounded-full p-2 bg-sky-500  hover:bg-sky-600 transition',
            isPosting && 'cursor:not-allowed opacity-60',
            !isPosting && 'cursor-pointer'
          )
        "
      >
        <HiPaperAirplane class="text-white" />
      </button>
    </form>
  </div>
</template>
