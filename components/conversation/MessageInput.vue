<script setup lang="ts">
interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
}
const modelValue = defineModel();
const { placeholder, id, type } = defineProps<MessageInputProps>();
</script>

<template>
  <div class="relative w-full">
    <input
      :id="id"
      v-model="modelValue"
      :type="type"
      autoComplete="off"
      :placeholder="placeholder"
      :required="required"
      class="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
    />
  </div>
</template>
