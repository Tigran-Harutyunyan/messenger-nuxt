<script setup lang="ts">
import EmptyState from "@/components/EmptyState.vue";

definePageMeta({ middleware: "auth", layout: "users" });
useHead({
  title: "Users | Messenger",
});
</script>

<template>
  <EmptyState />
</template>
