<script setup lang="ts">
import EmptyState from "@/components/EmptyState.vue";
import { useActiveChannel } from "@/composables/useActiveChannel";

definePageMeta({ middleware: "auth", layout: "conversations" });

useHead({
  title: "Conversations | Messenger",
});

const { pusherClient } = useNuxtApp();

useActiveChannel(pusherClient);
</script>

<template>
  <EmptyState />
</template>
