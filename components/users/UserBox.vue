<script setup lang="ts">
import Avatar from "@/components/Avatar.vue";
import { type User } from "@prisma/client";

interface UserBoxProps {
  data: User;
}

const { data } = defineProps<UserBoxProps>();

const router = useRouter();
const isLoading = ref(false);

const handleClick = async (id: string) => {
  isLoading.value = true;

  try {
    const data = await $fetch("/api/conversations", {
      method: "post",
      body: { userId: id },
    });

    if (data?.id) {
      router.push(`/conversations/${data.id}`);
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    @click="handleClick(data.id)"
    class="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
  >
    <Avatar :user="data" />
    <div class="min-w-0 flex-1">
      <div class="focus:outline-none">
        <span class="absolute inset-0" aria-hidden="true" />
        <div class="flex justify-between items-center mb-1">
          <p class="text-sm font-medium text-gray-900">
            {{ data.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
