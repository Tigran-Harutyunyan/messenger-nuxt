import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
  const showSettingsModal = ref(false);

  function toggleSettingsModal(isOpen = false) {
    showSettingsModal.value = isOpen;
  }

  return {
    showSettingsModal,
    toggleSettingsModal
  };
});
