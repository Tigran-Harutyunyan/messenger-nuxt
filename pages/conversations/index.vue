<script setup lang="ts">
import EmptyState from "@/components/EmptyState.vue";

definePageMeta({ middleware: "auth", layout: "conversations" });
useHead({
  title: "Conversations | Messenger",
});
</script>

<template>
  <EmptyState />
</template>
