import { defineStore } from "pinia";

export const useActiveListStore = defineStore("main", () => {
  const members = ref<string[]>([]);

  function add(id: string) {
    const newMembers = [...members.value, id];
    set(newMembers)
  }

  function remove(id: string) {
    const filteredMembers = members.value.filter((memberId) => memberId !== id);
    set(filteredMembers)
  }

  function set(ids: string[]) {
    members.value = ids;
  }


  return {
    members,
    add,
    remove,
    set
  };
});
