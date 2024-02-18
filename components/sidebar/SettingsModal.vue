<script setup lang="ts">
import { type User } from "@prisma/client";
import Input from "@/components/inputs/Input.vue";
import Modal from "@/components/modals/Modal.vue";
import Button from "@/components/Button.vue";
import { useNotification } from "naive-ui";

const notification = useNotification();

const { updateUser } = inject("user");

interface SettingsModalProps {
  isOpen?: boolean;
  currentUser: User;
}

const { isOpen, currentUser } = defineProps<SettingsModalProps>();

const emit = defineEmits(["close"]);

const image = ref(currentUser?.image || "");
const name = ref(currentUser?.name || "");

const isLoading = ref(false);

const onImageUpload = (result: string) => {
  image.value = result;
};

const onSubmit = async () => {
  if (!name.value) {
    notification.error({
      content: "Name field can't be blank.",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }

  isLoading.value = true;

  try {
    let response: unknown;

    response = await $fetch("/api/settings", {
      method: "POST",
      body: {
        name: name.value,
        image: image.value,
      },
    });

    if (response?.id) {
      notification.success({
        content: "Profile is updated",
        duration: 2500,
        keepAliveOnHover: true,
      });

      updateUser(response);
    }

    emit("close");
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
  <Modal :isOpen="isOpen" @close="emit('close')">
    <form @submit.prevent="onSubmit">
      <div class="space-y-12">
        <div class="border-b border-gray-900/10 pb-12">
          <h2 class="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p class="mt-1 text-sm leading-6 text-gray-600">
            Edit your public information.
          </p>

          <div class="mt-10 flex flex-col gap-y-8">
            <Input
              :disabled="isLoading"
              label="Name"
              id="name"
              required
              v-model="name"
            />
            <div>
              <label
                for="photo"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Photo
              </label>
              <div class="mt-2 flex items-center gap-x-3">
                <NuxtImg
                  width="48"
                  height="48"
                  class="rounded-full"
                  :src="image || '/images/placeholder.jpg'"
                  alt="Avatar"
                />

                <ImageUpload @change="onImageUpload" label="Change" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-end gap-x-6">
        <Button
          :disabled="isLoading"
          secondary
          type="button"
          @click.stop="emit('close')"
        >
          Cancel
        </Button>
        <Button :disabled="isLoading" type="submit">
          {{ isLoading ? "Saving..." : "Save" }}
        </Button>
      </div>
    </form>
  </Modal>
</template>
