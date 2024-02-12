<script setup lang="ts">
import clsx from "clsx";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  active?: boolean;
}
const { label, icon, href, active } = defineProps<DesktopItemProps>();
</script>

<template>
  <li @click="$emit('click', href)" :key="label">
    <NuxtLink
      :to="href"
      :class="
        clsx(
          `
            group 
            flex 
            gap-x-3 
            rounded-md 
            p-3 
            text-sm 
            leading-6 
            font-semibold 
            text-gray-500 
            hover:text-black 
            hover:bg-gray-100
          `,
          active && 'bg-gray-100 text-black'
        )
      "
    >
      <component :is="icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
      <span class="sr-only">{{ label }}</span>
    </NuxtLink>
  </li>
</template>
