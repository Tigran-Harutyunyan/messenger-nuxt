<script setup lang="ts">
const { data, signOut, status } = useAuth();

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div>conversations please</div>
  <button @click="signOut">sign out</button>
</template>
