<script setup lang="ts">
import type { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import Avatar from "@/components/Avatar.vue";
import AvatarGroup from "@/components/AvatarGroup.vue";
import ConfirmModal from "./ConfirmModal.vue";
const emit = defineEmits(["close"]);

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from "@headlessui/vue";

import { useOtherUser } from "@/composables/useOtherUser";
import { useActiveListStore } from "@/stores/useActiveListStore";

interface ProfileDrawerProps {
  isOpen: boolean;
  data: Conversation & {
    users: User[];
  };
}

const { isOpen, data } = defineProps<ProfileDrawerProps>();

const { data: session } = useAuth();

const otherUser = useOtherUser(data, session);

const { members } = storeToRefs(useActiveListStore());

const isConfirmOpen = ref(false);

const joinedDate = computed(() => {
  return format(new Date(otherUser.value.createdAt), "PP");
});

const title = computed(() => {
  return data.name || otherUser.value.name;
});

const isActive = members.value.indexOf(otherUser.value?.email!) !== -1;

const statusText = computed(() => {
  if (data.isGroup) {
    return `${data.users.length} members`;
  }

  return isActive ? "Active" : "Offline";
});

const onCloseDrawer = () => {
  if (!isConfirmOpen.value) {
    emit("close");
  }
};
</script>

<template>
  <ConfirmModal :isOpen="isConfirmOpen" @closeConfirm="isConfirmOpen = false" />

  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="onCloseDrawer">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0 "
      >
        <div class="fixed inset-0 bg-black bg-opacity-40"></div>
      </TransitionChild>
      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <div
                  class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl"
                >
                  <div class="px-4 sm:px-6">
                    <div class="flex items-start justify-end">
                      <div class="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          class="rounded-md bg-white text-gray-400 hover:text-gray-500"
                          @click.stop="emit('close')"
                        >
                          <span class="sr-only">Close panel</span>
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 512 512"
                            aria-hidden="true"
                            height="24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <div class="flex flex-col items-center">
                      <div class="mb-2">
                        <AvatarGroup :users="data.users" v-if="data.isGroup" />
                        <Avatar :user="otherUser" v-else />
                      </div>
                      <div>
                        {{ title }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ statusText }}
                      </div>
                      <div class="flex gap-10 my-8">
                        <div
                          @click="isConfirmOpen = true"
                          class="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75"
                        >
                          <div
                            class="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center"
                          >
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              stroke-width="0"
                              viewBox="0 0 512 512"
                              height="20"
                              width="20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill="none"
                                d="M296 64h-80a7.91 7.91 0 00-8 8v24h96V72a7.91 7.91 0 00-8-8z"
                              ></path>
                              <path
                                d="M432 96h-96V72a40 40 0 00-40-40h-80a40 40 0 00-40 40v24H80a16 16 0 000 32h17l19 304.92c1.42 26.85 22 47.08 48 47.08h184c26.13 0 46.3-19.78 48-47l19-305h17a16 16 0 000-32zM192.57 416H192a16 16 0 01-16-15.43l-8-224a16 16 0 1132-1.14l8 224A16 16 0 01192.57 416zM272 400a16 16 0 01-32 0V176a16 16 0 0132 0zm32-304h-96V72a7.91 7.91 0 018-8h80a7.91 7.91 0 018 8zm32 304.57A16 16 0 01320 416h-.58A16 16 0 01304 399.43l8-224a16 16 0 1132 1.14z"
                              ></path>
                            </svg>
                          </div>
                          <div class="text-sm font-light text-neutral-600">
                            Delete
                          </div>
                        </div>
                      </div>
                      <div class="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                        <dl class="space-y-8 px-4 sm:space-y-6 sm:px-6">
                          <div v-if="data.isGroup">
                            <dt
                              class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0"
                            >
                              Emails
                            </dt>
                            <dd
                              class="mt-1 text-sm text-gray-900 sm:col-span-2"
                            >
                              {{
                                data.users.map((user) => user.email).join(", ")
                              }}
                            </dd>
                          </div>
                          <div v-if="!data.isGroup">
                            <dt
                              class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0"
                            >
                              Email
                            </dt>
                            <dd
                              class="mt-1 text-sm text-gray-900 sm:col-span-2"
                            >
                              {{ otherUser.email }}
                            </dd>
                          </div>
                          <template v-if="!data.isGroup">
                            <hr />
                            <div>
                              <dt
                                class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0"
                              >
                                Joined
                              </dt>
                              <dd
                                class="mt-1 text-sm text-gray-900 sm:col-span-2"
                              >
                                <time :dateTime="joinedDate">
                                  {{ joinedDate }}
                                </time>
                              </dd>
                            </div>
                          </template>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
