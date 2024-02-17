<script setup lang="ts">
import { type User } from "@prisma/client";
import Input from "@/components/inputs/Input.vue";
import Modal from "@/components/modals/Modal.vue";
import { useNotification } from "naive-ui";

const notification = useNotification();

interface GroupChatModalProps {
  isOpen?: boolean;
  users: User[];
}
const { isOpen, users } = defineProps<GroupChatModalProps>();

const emit = defineEmits(["close"]);

const isLoading = ref(false);

const name = ref();

const members = ref([]);

const options = computed(() => {
  if (!users) return [];
  return users.map((user) => ({
    value: user.id,
    label: user.name,
  }));
});

const onSubmit = async () => {
  if (!name.value) {
    notification.error({
      content: "Group name is required",
      duration: 2500,
    });
    return;
  }

  if (members.value.length < 2) {
    notification.error({
      content: "Select at least two members to continue",
      duration: 2500,
    });
    return;
  }

  isLoading.value = true;

  try {
    let response: unknown;
    response = await $fetch("/api/conversations", {
      method: "POST",
      body: {
        isGroup: true,
        name: name.value,
        members: members.value.map((item) => {
          return {
            value: item,
          };
        }),
      },
    });

    if (response?.id) {
      notification.success({
        content: "Group chat is created",
        duration: 2500,
      });
    }

    onClose();
  } catch (error) {
    notification.error({
      content: "Something went wrong!",
      duration: 2500,
    });
  } finally {
    isLoading.value = false;
  }
};

const onClose = () => {
  members.value = [];
  name.value = "";
  emit("close");
};
</script>

<template>
  <Modal :isOpen="isOpen" @close="onClose">
    <form @submit.prevent="onSubmit">
      <div class="space-y-12">
        <div class="border-b border-gray-900/10 pb-12">
          <h2 class="text-base font-semibold leading-7 text-gray-900">
            Create a group chat
          </h2>
          <p class="mt-1 text-sm leading-6 text-gray-600">
            Create a chat with more than 2 people.
          </p>
          <div class="mt-10 flex flex-col gap-y-8">
            <Input
              :disabled="isLoading"
              label="Name"
              id="name"
              required
              v-model="name"
            />

            <n-select v-model:value="members" multiple :options="options" />
          </div>
        </div>
      </div>
      <div class="mt-6 flex items-center justify-end gap-x-6">
        <Button
          :disabled="isLoading"
          @click="emit('close')"
          type="button"
          secondary
        >
          Cancel
        </Button>
        <Button :disabled="isLoading" type="submit">
          {{ isLoading ? "Creating..." : "Create" }}
        </Button>
      </div>
    </form>
  </Modal>
</template>
