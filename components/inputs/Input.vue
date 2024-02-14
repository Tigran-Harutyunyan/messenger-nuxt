<script setup lang="ts">
import clsx from "clsx";

const modelValue = defineModel();

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

const { label, id, type = "text", disabled } = defineProps<InputProps>();
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-medium leading-6 text-gray-900">
      {{ label }}
    </label>
    <div class="mt-2">
      <input
        v-model="modelValue"
        :id="id"
        :type="type"
        autoComplete="id"
        :disabled="disabled"
        :class="
          clsx(
            ` form-input block w-full rounded-md    
      border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
      placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600
      sm:text-sm sm:leading-6`,
            disabled && 'opacity-50 cursor-default'
          )
        "
      />
    </div>
  </div>
</template>
