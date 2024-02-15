<script setup lang="ts">
import AuthForm from "@/components/AuthForm.vue";

definePageMeta({ middleware: "public" });

useHead({
  title: "Messenger",
});

const { status } = useAuth();
</script>

<template>
  <div
    class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <NuxtImg
        height="48"
        width="48"
        class="mx-auto"
        src="/images/logo.png"
        alt="Logo"
      />
      <h2
        class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900"
      >
        Sign in to your account
      </h2>
    </div>
    <AuthForm v-if="status !== 'authenticated'" />
  </div>
</template>
