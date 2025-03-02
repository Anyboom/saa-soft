<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import UpdateUserForm from '@/components/forms/UpdateUserForm.vue'
import { useUserStore } from '@/stores/user.store.ts'

const userStore = useUserStore();

</script>

<template>
  <section class="mt-[5rem]">
    <div class="container mx-auto">
      <div class="flex gap-4 mb-[1rem]">
        <h1 class="text-xl">Учетные записи</h1>
        <Button icon="pi pi-plus" outlined severity="secondary" @click="userStore.createEmptyUser"></Button>
      </div>
      <Message severity="secondary" class="mb-[1rem]">
        <template #icon>
          <i class="pi pi-question"></i>
        </template>
        <span class="ml-2">
          Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
        </span>
      </Message>
      <table class="w-full border-separate border-spacing-2">
        <thead>
          <tr class="text-left">
            <th>Метки</th>
            <th>Тип записи</th>
            <th>Логин</th>
            <th>Пароль</th>
          </tr>
        </thead>
        <tbody>
          <UpdateUserForm v-for="(user, index) of userStore.values" :key="index"
                          :initial-values="user" />
        </tbody>
      </table>
    </div>
  </section>
</template>

