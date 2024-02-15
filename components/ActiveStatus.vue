<script setup lang="ts">
import { useActiveChannel } from "@/composables/useActiveChannel";
const { pusherClient } = useNuxtApp();
useActiveChannel(pusherClient);
</script>
<template></template>
