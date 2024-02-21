<script setup lang="ts"></script>

<template>
  <aside
    class="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200"
  >
    <div class="px-5">
      <div class="flex justify-between mb-4 pt-4">
        <div class="text-2xl font-bold text-neutral-800">Messages</div>
      </div>
    </div>

    <div class="space-y-2">
      <div class="px-5 flex gap-2">
        <n-skeleton height="40px" circle />
        <n-skeleton height="40px" width="82%" :sharp="false" />
      </div>

      <div class="px-5 flex gap-2">
        <n-skeleton height="40px" circle />
        <n-skeleton height="40px" width="82%" :sharp="false" />
      </div>

      <div class="px-5 flex gap-2">
        <n-skeleton height="40px" circle />
        <n-skeleton height="40px" width="82%" :sharp="false" />
      </div>
    </div>
  </aside>
</template>
