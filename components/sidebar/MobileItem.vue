<script setup lang="ts">
import clsx from "clsx";
const emit = defineEmits(["click"]);

interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
}
const { href, icon, active } = defineProps<MobileItemProps>();
</script>

<template>
  <NuxtLink
    @click="emit('click', href)"
    :href="href"
    :class="
      clsx(
        `
        group 
        flex 
        gap-x-3 
        text-sm 
        leading-6 
        font-semibold 
        w-full 
        justify-center 
        p-4 
        text-gray-500 
        hover:text-black 
        hover:bg-gray-100
      `,
        active && 'bg-gray-100 text-black'
      )
    "
  >
    <component :is="icon" class="h-6 w-6" />
  </NuxtLink>
</template>
