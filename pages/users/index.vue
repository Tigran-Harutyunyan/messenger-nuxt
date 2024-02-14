<script setup lang="ts">
import EmptyState from "@/components/EmptyState.vue";

definePageMeta({ middleware: "auth", layout: "users" });
</script>

<template>
  <EmptyState />
</template>
