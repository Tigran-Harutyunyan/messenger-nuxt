import { defineStore } from "pinia";
import { type User } from "@prisma/client";

export const useMainStore = defineStore("main", () => {
  const showSettingsModal = ref(false);
  const currentUser = ref<User>();

  function toggleSettingsModal(isOpen = false) {
    showSettingsModal.value = isOpen;
  }

  function updateUser(user: User) {
    currentUser.value = user;
  }

  return {
    showSettingsModal,
    currentUser,
    updateUser,
    toggleSettingsModal
  };
});
