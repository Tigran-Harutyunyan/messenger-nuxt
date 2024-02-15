<script setup lang="ts">
import { useActiveChannel } from "@/composables/useActiveChannel";

const { pusherClient } = useNuxtApp();
useActiveChannel(pusherClient);
</script>
<template>
  <naive-config>
    <n-notification-provider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </n-notification-provider>
  </naive-config>
</template>
