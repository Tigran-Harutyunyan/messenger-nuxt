<script setup lang="ts">
import { type User } from "@prisma/client";
import Input from "@/components/inputs/Input.vue";
import Modal from "@/components/modals/Modal.vue";
import {
  useNotification,
  NAvatar,
  NTag,
  type SelectRenderTag,
  type SelectRenderLabel,
} from "naive-ui";

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
    image: user.image,
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
    const response = await $fetch("/api/conversations", {
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

    if (response && typeof response === "object" && "id" in response) {
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

const renderMultipleSelectTag: SelectRenderTag = ({ option, handleClose }) => {
  return h(
    NTag,
    {
      style: {
        padding: "0 6px 0 4px",
      },
      round: true,
      closable: true,
      onClose: (e) => {
        e.stopPropagation();
        handleClose();
      },
    },
    {
      default: () =>
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
            },
          },
          [
            h(NAvatar, {
              src: option.image || "/images/placeholder.jpg",
              round: true,
              size: 22,
              style: {
                marginRight: "4px",
              },
            }),
            option.label as string,
          ]
        ),
    }
  );
};
const renderLabel: SelectRenderLabel = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(NAvatar, {
        src: option.image || "/images/placeholder.jpg",
        round: true,
        size: "small",
      }),
      h(
        "div",
        {
          style: {
            marginLeft: "12px",
            padding: "4px 0",
          },
        },
        [
          h(
            "div",
            {
              style: {
                marginLeft: "12px",
                padding: "4px 0",
              },
            },
            null,
            [option.label as string]
          ),
        ]
      ),
    ]
  );
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

            <n-select
              v-model:value="members"
              placement="top-start"
              multiple
              :options="options"
              clearable
              :render-label="renderLabel"
              :render-tag="renderMultipleSelectTag"
            />
          </div>
        </div>
      </div>
      <div class="mt-6 flex items-center justify-end gap-x-6">
        <Button :disabled="isLoading" @click="onClose" type="button" secondary>
          Cancel
        </Button>
        <Button :disabled="isLoading" type="submit">
          {{ isLoading ? "Creating..." : "Create" }}
        </Button>
      </div>
    </form>
  </Modal>
</template>
