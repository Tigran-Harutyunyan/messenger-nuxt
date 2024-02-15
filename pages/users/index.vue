<script setup lang="ts">
import EmptyState from "@/components/EmptyState.vue";

definePageMeta({ middleware: "auth", layout: "users" });

import { useActiveChannel } from "@/composables/useActiveChannel";

const { pusherClient } = useNuxtApp();
useActiveChannel(pusherClient);

useHead({
  title: "Users | Messenger",
});
</script>

<template>
  <EmptyState />
</template>
