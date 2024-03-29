<script setup lang="ts">
import Modal from "@/components/modals/Modal.vue";
import Button from "@/components/Button.vue";
import FiAlertTriangle from "@/components/ui/icons/FiAlertTriangle.vue";
import { DialogPanel } from "@headlessui/vue";
import { useNotification } from "naive-ui";
const notification = useNotification();

interface ConfirmModalProps {
  isOpen?: boolean;
}

const emit = defineEmits(["closeConfirm"]);

const { isOpen } = defineProps<ConfirmModalProps>();

const isLoading = ref(false);

const onDelete = async () => {
  isLoading.value = true;
  emit("closeConfirm");

  try {
    await $fetch(`/api/conversations/${useRoute().params.conversationId}`, {
      method: "DELETE",
    });
  } catch (error) {
    notification.error({
      content: "Something went wrong!",
      duration: 2500,
      keepAliveOnHover: true,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Modal :isOpen="isOpen" @close="emit('closeConfirm')">
    <div class="sm:flex sm:items-start z-50">
      <div
        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
      >
        <FiAlertTriangle class="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
      <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
        <DialogPanel
          as="h3"
          class="text-base font-semibold leading-6 text-gray-900"
        >
          Delete conversation
        </DialogPanel>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            Are you sure you want to delete this conversation? This action
            cannot be undone.
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-4 sm:flex flex justify-end gap-x-4">
      <Button :disabled="isLoading" secondary @click="emit('closeConfirm')">
        Cancel
      </Button>
      <Button :disabled="isLoading" danger @click="onDelete"> Delete </Button>
    </div>
  </Modal>
</template>
