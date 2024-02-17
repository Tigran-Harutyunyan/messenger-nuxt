import { defineStore } from "pinia";
import type { FullMessageType } from "@/types";

export const useMainStore = defineStore("main", () => {
  const newMessagge = ref<FullMessageType>();

  function changeNewMessage(message: FullMessageType) {
    newMessagge.value = message;
  }

  return {
    newMessagge,
    changeNewMessage
  };
});
