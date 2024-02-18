<script setup lang="ts">
import type { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import Avatar from "@/components/Avatar.vue";

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

const joinedDate = computed(() => {
  return format(new Date(otherUser.value.createdAt), "PP");
});

const title = computed(() => {
  return data.name || otherUser.value.name;
});

const isActive = computed(() => {
  return members.value.indexOf(otherUser.value?.email!) !== -1;
});

const statusText = computed(() => {
  if (data.isGroup) {
    return `${data.users.length} members`;
  }

  return isActive.value ? "Active" : "Offline";
});

const onCloseDrawer = () => {
  emit("close");
};
</script>

<template>
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
                        <Avatar :user="otherUser" v-if="!data.isGroup" />
                      </div>

                      <template v-if="!data.isGroup">
                        <div>{{ title }}</div>

                        <div class="text-sm text-gray-500">
                          {{ statusText }}
                        </div>
                      </template>

                      <template v-else>
                        <div class="font-semibold text-xl">{{ title }}</div>

                        <div class="text-sm text-gray-500 mt-1 mb-4">
                          {{ statusText }}
                        </div>
                      </template>

                      <div class="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                        <dl class="space-y-8 sm:space-y-6">
                          <div v-if="data.isGroup">
                            <dd
                              class="mt-1 text-sm text-gray-900 sm:col-span-2 flex flex-wrap"
                            >
                              <div
                                class="w-full relative flex items-center space-x-3 p-3 bg-white"
                                v-for="user in data.users"
                              >
                                <div class="relative">
                                  <Avatar :user="user" />
                                </div>

                                <div class="focus:outline-none">
                                  <div
                                    class="flex justify-between items-center mb-1"
                                  >
                                    <p
                                      class="text-md font-medium text-gray-900"
                                    >
                                      {{ user.name }}
                                    </p>
                                  </div>
                                  <p class="truncate text-sm text-gray-500">
                                    {{ user.email }}
                                  </p>
                                </div>
                              </div>
                            </dd>
                          </div>

                          <div v-if="!data.isGroup">
                            <dt
                              class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 mt-4"
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
