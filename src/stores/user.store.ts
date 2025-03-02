import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserType } from '@/types/user.type.ts'
import { TypeRecordEnum } from '@/enum/type-record.enum.ts'
import { v4 as GenerateUUID } from 'uuid'

export const useUserStore = defineStore("user", () => {
  const data = ref<UserType[]>([]);

  if (localStorage.getItem("values")) {
    try {
      const json = localStorage.getItem("values") as string;

      data.value = JSON.parse(json) as UserType[];
    } catch {
      data.value.length = 0;
    }
  }

  function createEmptyUser() {
    data.value.push({
      id: null,
      mark: [],
      type: TypeRecordEnum.LOCAL,
      login: String(),
      password: String()
    })
  }

  const values = computed(() => data.value);

  function updateUser(user: UserType) {
    const index = data.value.findIndex((entity) => entity.id === user.id)

    if (index >= 0) {
      data.value[index] = user;
    }

    if (user.id == null) {
      user.id = GenerateUUID();
    }

    const result = data.value.filter((user) => user.id !== null);

    localStorage.setItem('values', JSON.stringify(result));
  }

  function deleteUser(userId: string | null) {
    if (userId === null) {
      return;
    }

    const index = data.value.findIndex((entity) => entity.id === userId)

    if (index >= 0) {
      data.value.splice(index, 1);

      const result = data.value.filter((user) => user.id !== null);

      localStorage.setItem('values', JSON.stringify(result));
    }
  }

  return {
    values,
    createEmptyUser,
    updateUser,
    deleteUser
  }
})
