<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { computed, onMounted, ref, toRaw } from 'vue'
import { TypeRecordEnum } from '@/enum/type-record.enum.ts'
import Password from 'primevue/password'
import type { UserType } from '@/types/user.type.ts'
import { debounce } from '@/utils/debounce.utility.ts'
import { z } from 'zod'
import { useUserStore } from '@/stores/user.store.ts'

const userStore = useUserStore();

const recordTypes = [
  {
    name: 'LDAP',
    value: TypeRecordEnum.LDAP,
  },
  {
    name: 'Локальная',
    value: TypeRecordEnum.LOCAL,
  },
];

const props = defineProps<{
  initialValues?: UserType
}>()

const schema = z.object({
  login: z.string().min(1).max(100).trim(),
  password: z.string().min(1).max(100).trim(),
  mark: z.string().max(50).trim()
});

onMounted(() => {
  if (props.initialValues) {
    const initialValues = structuredClone(toRaw(props.initialValues))

    data.value = {
      login: initialValues.login,
      mark: initialValues.mark.map((item) => item.text).join(";"),
      type: initialValues.type,
      password: initialValues.password ?? null,
      id: initialValues.id
    }
  }
})

type UserDto = {
  id: string | null;
  login: string;
  mark: string;
  type: TypeRecordEnum;
  password: string | null;
}

const data = ref<UserDto>({
  id: String(),
  login: String(),
  mark: String(),
  type: TypeRecordEnum.LOCAL,
  password: String()
})

const errors = ref<Record<string, unknown>>({});

const onSubmit = debounce(() => {
  errors.value = {};

  const validation = schema.safeParse(data.value);

  if (validation.success) {

    if (data.value.type == TypeRecordEnum.LDAP) {
      data.value.password = null;
    }

    const updateUser: UserType = {
      type: data.value.type,
      password: data.value.password,
      mark: data.value.mark.split(";").map((item) => {
        return { text: item };
      }),
      login: data.value.login,
      id: data.value.id
    }

    userStore.updateUser(updateUser);
  } else {
    errors.value = validation.error.format()
  }
}, 300);

const isPasswordVisible = computed(() => data.value.type === TypeRecordEnum.LOCAL)
</script>

<template>
  <tr>
    <td>
      <InputText v-model="data.mark" :invalid="!!errors?.mark" class="w-full" type="text"
                 @focusout="onSubmit" />
    </td>
    <td>
      <Select v-model="data.type" :options="recordTypes" class="w-full" option-label="name"
              option-value="value" @change="onSubmit" />
    </td>
    <td :colspan="!isPasswordVisible ? 2 : 1">
      <InputText v-model="data.login" class="w-full" :invalid="!!errors?.login" type="text"
                 @focusout="onSubmit" />
    </td>
    <td :class="{'hidden': !isPasswordVisible}">
      <Password v-model="data.password" :invalid="!!errors?.password" class="w-full" type="text"
                :feedback="false"
                toggleMask @focusout="onSubmit" />
    </td>
    <td>
      <Button
        class="!h-full !w-full"
        icon="pi pi-trash"
        outlined
        severity="danger"
        variant="text"
        @click="userStore.deleteUser(data.id)"
      />
    </td>
  </tr>
</template>
