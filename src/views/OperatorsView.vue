<script lang="ts" setup>
import type { Operator } from '../models/operators/operator.inteface'
import { onMounted, ref, watch } from 'vue'
import { fetchOperators, postOperator, putOperator, removeOperator } from '../utils/operators.utils'
import type { RoleModel } from '@/models/role/model.interface'
import { fetchRoles } from '@/utils/role.utils'

const search = ref('' as string)
const isCreateActive = ref<boolean>(false)
const isUpdateActive = ref<boolean>(false)

const operatorObject = ref<Operator>({
  id: 0,
  name: '',
  lastname: '',
  login: '',
  password: '',
  roleId: 0,
  roleName: '',
  active: false
})

const headers = ref([
  { key: 'id', title: 'ID', align: 'center' },
  { key: 'name', title: 'Имя', align: 'center' },
  { key: 'lastname', title: 'Фамилия', align: 'center' },
  { key: 'roleName', title: 'Роль', align: 'center' },
  { key: 'active', title: 'Активен', align: 'center' },
  { key: 'update', title: 'Изменить', align: 'center' },
  { key: 'action', title: 'Удалить', align: 'center' }
])

const desserts = ref([] as Operator[])
const roles = ref([] as RoleModel[])

const getOperators = async () => {
  desserts.value = await fetchOperators()
}

const getRoles = async () => {
  roles.value = await fetchRoles()
}

const isValidOperatorForm = (): boolean => {
  return (
    !!operatorObject.value.name &&
    !!operatorObject.value.lastname &&
    !!operatorObject.value.login &&
    !!operatorObject.value.password &&
    operatorObject.value.roleId !== 0
  )
}

const createOperator = async () => {
  if (
    !operatorObject.value.name ||
    !operatorObject.value.lastname ||
    !operatorObject.value.login ||
    !operatorObject.value.password ||
    operatorObject.value.roleId === 0
  ) {
    alert('Пожалуйста, заполните все обязательные поля и выберите роль.')
    return
  }

  await postOperator(operatorObject.value)
  await getOperators()
  isCreateActive.value = false
  resetOperatorObject()
}

const show = async (id: number) => {
  const selectedOperator = desserts.value.find((e) => e.id === id)
  if (selectedOperator) {
    operatorObject.value = { ...selectedOperator }
    operatorObject.value.id = id
    isCreateActive.value = true
    isUpdateActive.value = true
  } else {
    console.error(`Operator with id ${id} not found.`)
  }
}

const close = () => {
  isCreateActive.value = false
  isUpdateActive.value = false
}

const updateOperator = async () => {
  if (
    !operatorObject.value.name ||
    !operatorObject.value.lastname ||
    !operatorObject.value.login ||
    !operatorObject.value.password ||
    operatorObject.value.roleId === 0
  ) {
    alert('Пожалуйста, заполните все обязательные поля и выберите роль.')
    return
  }

  await putOperator(operatorObject.value.id, operatorObject.value)
  await getOperators()
  resetOperatorObject()
  isCreateActive.value = false
  isUpdateActive.value = false
}

const deleteOperator = async (id: number) => {
  if (confirm("Вы уверены в своих действиях?")) {
    await removeOperator(id)
    await getOperators()
  }

}

const resetOperatorObject = () => {
  operatorObject.value = {
    id: 0,
    name: '',
    lastname: '',
    login: '',
    password: '',
    roleId: 0,
    roleName: '',
    active: false
  }
}

watch(isCreateActive, (newValue) => {
  if (!newValue) {
    resetOperatorObject()
  }
})

onMounted(() => {
  getOperators()
  getRoles()
  setInterval(() => {
    getOperators()
    getRoles()
  }, 10000)
})
</script>

<template>
  <div class="role-container">
    <div class="role-title text-3xl text-center">Операторы</div>
    <div class="role-body w-full">
      <div class="createDiv">
        <v-dialog v-model="isCreateActive" max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="surface-variant" text="Создать" variant="flat"></v-btn>
          </template>

          <template v-slot:default>
            <v-card title="Изменение">
              <v-card-text>
                <form>
                  <div class="form-floating mb-3">
                    <input v-model="operatorObject.name" type="text" class="form-control" id="floatingInput"
                      placeholder="name@example.com" />
                    <label for="floatingInput">Имя</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="operatorObject.lastname" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Фамилия</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="operatorObject.login" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Имя пользователя</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="operatorObject.password" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Пароль</label>
                  </div>
                  <div class="form-floating mb-3">
                    <select v-model="operatorObject.roleId" class="form-select" aria-label="Default select example">
                      <option value="0" disabled selected>Выберите роль</option>
                      <option :value="role.id" v-for="role in roles" :key="role.id">
                        {{ role.name }}
                      </option>
                    </select>
                  </div>
                </form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="isUpdateActive" :disabled="!isValidOperatorForm()" @click="updateOperator()"
                  text="Изменить"></v-btn>
                <v-btn v-else :disabled="!isValidOperatorForm()" @click="createOperator()" text="Сохранить"></v-btn>
                <v-btn text="Закрыть" @click="close()"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>
      <v-card flat title="">
        <template v-slot:text>
          <v-text-field v-model="search" label="Искать" prepend-inner-icon="mdi-magnify" single-line variant="outlined"
            hide-details></v-text-field>
        </template>

        <v-data-table :headers="headers" items-per-page-text="Элементов на странице" :items="desserts" :search="search"
          no-data-text="Данные отсутствуют">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.lastname }}</td>
              <td>{{ item.roleName }}</td>
              <td>
                <i v-if="item.active" class="fas fa-circle text-green-500"></i>
                <i v-else class="fas fa-circle text-red-500"></i>
              </td>
              <td>
                <v-btn class="w-24" fab dark small color="green" @click="show(item.id)">Изменить</v-btn>
              </td>
              <td>
                <v-btn class="w-24" fab dark small color="red" @click="deleteOperator(item.id)">Удалить</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
tr,
td {
  text-align: center;
}
</style>
