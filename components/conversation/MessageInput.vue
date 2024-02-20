<script setup lang="ts">
interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
}
const modelValue = defineModel();
const { placeholder, id, type } = defineProps<MessageInputProps>();

// const inputRef = ref(null);
// onMounted(() => {
//   inputRef?.value.focus();
// });
</script>

<template>
  <div class="relative w-full">
    <input
      :id="id"
      v-model="modelValue"
      :type="type"
      ref="inputRef"
      autoComplete="off"
      :placeholder="placeholder"
      :required="required"
      class="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
    />
  </div>
</template>
