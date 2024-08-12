<script lang="ts" setup>
import type { Window } from '../models/windows/windows.interface'
import { onMounted, ref, watch } from 'vue'
import { fetchWindows, postWindow, putWindow, removeWindow } from '../utils/windows.utils'
import type { Branch } from '@/models/branches/branches.interface'
import { fetchBranches } from '@/utils/branches.utils'

const search = ref('' as string)
const headers = ref([
  { key: 'id', title: 'ID', align: 'center' },
  { key: 'name', title: 'Название', align: 'center' },
  { key: 'number', title: 'Номер', align: 'center' },
  { key: 'branchName', title: 'Отделение', align: 'center' },
  { key: 'description', title: 'Описание', align: 'center' },
  { key: 'active', title: 'Активен', align: 'center' },
  { key: 'action', title: 'Изменить', align: 'center' },
  { key: 'action', title: 'Удалить', align: 'center' }
])
const desserts = ref([] as Window[])
const branches = ref([] as Branch[])

const isCreateActive = ref<boolean>(false)
const isUpdateActive = ref<boolean>(false)

const WindowObject = ref<Window>({
  id: 0,
  branchId: 0,
  branchName: '',
  number: 0,
  name: '',
  description: '',
  active: false
})

const getBranches = async () => {
  branches.value = await fetchBranches()
}
const getWindows = async () => {
  desserts.value = await fetchWindows()
  // console.log(desserts.value)
}
const createWindow = async () => {
  if (!WindowObject.value.name) {
    alert('Невозможно создать окно без названия')
    return
  }
  // console.log(branchObject.value);
  await postWindow(WindowObject.value)
  getWindows()
  isCreateActive.value = false
  resetWindowObject()
}
const show = async (id: number) => {
  const selectedWindow = desserts.value.find((e) => e.id === id)
  // Check if the selected branch is defined
  if (selectedWindow) {
    // Assign the found branch to branchObject
    WindowObject.value = { ...selectedWindow }
    WindowObject.value.id = id
    isCreateActive.value = true
    isUpdateActive.value = true
  } else {
    console.error(`Window with id ${id} not found.`)
    // Handle the case where the branch is not found, e.g., by showing a notification or error message
  }
}
const close = () => {
  isCreateActive.value = false
  isUpdateActive.value = false
}
const updateWindow = async () => {
  console.log(WindowObject.value)
  await putWindow(WindowObject.value.id, WindowObject.value)
  await getWindows()
  resetWindowObject()
  isCreateActive.value = false
  isUpdateActive.value = false
  // console.log(branchObject.value);
}
const deleteWindow = async (id: number) => {
  if (confirm("Вы уверены в своих действиях?")) {
    await removeWindow(id)
    await getWindows()
  }
}
const resetWindowObject = () => {
  WindowObject.value = {
    id: 0,
    branchId: 0,
    branchName: '',
    number: 0,
    name: '',
    description: '',
    active: false
  }
}
watch(isCreateActive, (newValue) => {
  if (!newValue) {
    resetWindowObject()
  }
})
onMounted(() => {
  getWindows()
  getBranches()
  setInterval(() => {
    getWindows()
    getBranches()
  }, 10000)
})
</script>
<template>
  <div class="Window-container">
    <div class="Window-title text-3xl text-center">Окна</div>
    <div class="Window-body w-full">
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
                    <input v-model="WindowObject.name" type="text" class="form-control" id="floatingInput"
                      placeholder="name@example.com" />
                    <label for="floatingInput">Название</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="WindowObject.number" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Номер</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="WindowObject.description" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Описание</label>
                  </div>

                  <div class="form-floating mb-3">
                    <select v-model="WindowObject.branchId" class="form-select" aria-label="Default select example">
                      <option value="null" selected>Выберите Отделение</option>
                      <option :value="branch.id" v-for="branch in branches" :key="branch.id">
                        {{ branch.name }}
                      </option>
                    </select>
                  </div>
                </form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="isUpdateActive" @click="updateWindow()" text="Изменить"></v-btn>
                <v-btn v-else @click="createWindow()" text="Сохранить"></v-btn>
                <v-btn text="Закрыть" @click="close()"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>
      <v-card v-if="desserts" flat title="">
        <template v-slot:text>
          <v-text-field v-model="search" label="Искать" prepend-inner-icon="mdi-magnify" single-line variant="outlined"
            hide-details></v-text-field>
        </template>

        <v-data-table :headers="headers" items-per-page-text="Элементов на странице" :items="desserts" :search="search"
          no-data-text="Данные отсутствуют">
          <template v-slot:item="{ item }">
            <tr>
              <td>
                {{ item.id }}
              </td>
              <td>
                {{ item.name }}
              </td>
              <td>
                {{ item.number }}
              </td>
              <td>
                {{ item.branchName }}
              </td>
              <td>
                {{ item.description }}
              </td>
              <td>
                <i v-if="item.active" class="fas fa-circle text-green-500"></i>
                <i v-else class="fas fa-circle text-red-500"></i>
              </td>
              <td>
                <v-btn class="w-24" fab dark small color="green" @click="show(item.id)">Изменить</v-btn>
              </td>
              <td>
                <v-btn class="w-24" fab dark small color="red" @click="deleteWindow(item.id)">Удалить</v-btn>
              </td>
            </tr>
            <!-- <v-btn class="w-24" fab dark small color="green"  @click="update(item.id)">Изменить</v-btn> -->
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
