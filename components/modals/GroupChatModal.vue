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

    close();
  } catch (error) {
    notification.error({
      content: "Something went wrong!",
      duration: 2500,
    });
  } finally {
    isLoading.value = false;
  }
};

const close = () => {
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
      onClose: (e: MouseEvent) => {
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
  <Modal :isOpen="isOpen" @close="close">
    <form @submit.prevent="onSubmit">
      <div class="space-y-12">
        <div class="pb-8">
          <h2 class="text-base font-semibold leading-7 text-gray-900">
            New group chat
          </h2>
          <div class="mt-10 flex flex-col gap-y-4">
            <Input
              :disabled="isLoading"
              label="Name"
              id="name"
              required
              v-model="name"
            />

            <div>
              <label
                class="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >Users</label
              >

              <n-select
                v-model:value="members"
                placeholder="Select at least 2 users"
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
      </div>
      <div class="mt-6 flex items-center justify-end gap-x-4">
        <Button :disabled="isLoading" @click="close" type="button" secondary>
          Cancel
        </Button>
        <Button :disabled="isLoading" type="submit">
          {{ isLoading ? "Creating..." : "Create" }}
        </Button>
      </div>
    </form>
  </Modal>
</template>
