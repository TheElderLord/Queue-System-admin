<script lang="ts" setup>
import type { Branch } from '../models/branches/branches.interface'
import { onMounted, ref, watch } from 'vue'
import { fetchBranches, postBranch, putBranch, removeBranch } from '../utils/branches.utils'
import cloneDeep from 'lodash/cloneDeep'

const search = ref<String>('')

const isCreateActive = ref<Boolean>(false)

const isUpdateActive = ref<Boolean>(false)

const branchObject = ref({} as Branch)

const headers = ref([
  { key: 'id', title: 'ID', align: 'center' },
  { key: 'name', title: 'Название', align: 'center' },
  { key: 'description', title: 'Описание', align: 'center' },
  { key: 'parentName', title: 'Родитель', align: 'center' },
  { key: 'lat', title: 'Широта', align: 'center' },
  { key: 'lng', title: 'Долгота', align: 'center' },
  { key: 'update', title: 'Обновить', align: 'center' },
  { key: 'delete', title: 'Удалить', align: 'center' }
])

const desserts = ref([] as Branch[])

const getBranches = async () => {
  desserts.value = await fetchBranches()
  // Update parent names for display purposes
  desserts.value.forEach((branch) => {
    const parentBranch = desserts.value.find((b) => b.id === branch.parentId)
    branch.parentName = parentBranch ? parentBranch.name : ''
  })
  console.log('Branches loaded:', desserts.value) // Debugging
}

const createBranch = async () => {
  if (!branchObject.value.name) {
    alert('Невозможно создать отделение без названия')
    return
  }

  if (branchObject.value.parentId === branchObject.value.id) {
    alert('Отделение не может быть своим родительским отделением')
    return
  }

  await postBranch(branchObject.value)
  await getBranches()
  isCreateActive.value = false
  resetBranchObject()
}

const show = (id: number) => {
  const selectedBranch = desserts.value.find((e) => e.id === id)
  // Check if the selected branch is defined
  if (selectedBranch) {
    // Assign the found branch to branchObject
    branchObject.value = cloneDeep(selectedBranch)
    branchObject.value.parentId = selectedBranch.parentId // Ensure parentId is correctly set
    branchObject.value.id = id
    branchObject.value.lat = selectedBranch.lat
    branchObject.value.lng = selectedBranch.lng
    isCreateActive.value = true
    isUpdateActive.value = true
  } else {
    console.error(`Branch with id ${id} not found.`)
    // Handle the case where the branch is not found, e.g., by showing a notification or error message
  }
}

const updateBranch = async () => {
  if (branchObject.value.parentId === branchObject.value.id) {
    alert('Отделение не может быть своим родительским отделением')
    return
  }

  console.log('Updating branch with data:', branchObject.value) // Debugging
  await putBranch(branchObject.value.id, branchObject.value)

  // Получаем обновленные данные отделений
  await getBranches()

  resetBranchObject() // Сбрасываем branchObject
  isCreateActive.value = false
  isUpdateActive.value = false
}

const deleteBranch = async (id: number) => {
  if (confirm("Вы уверены?")) {
    await removeBranch(id)
    await getBranches()
  }
}

const resetBranchObject = () => {
  branchObject.value = cloneDeep({
    id: 0,
    name: '',
    description: '',
    parentId: null,
    parentName: '',
    lat: 0,
    lng: 0
  })
}

// Function to check if a branch is a child of the selected branchObject
const isChild = (branch: Branch, selectedId: number) => {
  // If branch has a parentId and it matches the selectedId, it's a child
  return branch.parentId !== null && branch.parentId === selectedId
}

watch(isCreateActive, (newValue) => {
  if (!newValue) {
    resetBranchObject()
  }
})

onMounted(() => {
  getBranches()
  setInterval(() => {
    getBranches()
  }, 10000)
})
</script>

<template>
  <div class="role-container">
    <div class="role-title text-3xl text-center">Отделения</div>
    <div class="role-body w-full">
      <div class="createDiv">
        <v-dialog v-model="isCreateActive" max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="surface-variant" text="Создать" variant="flat"></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card title="Изменение">
              <v-card-text>
                <form>
                  <div class="form-floating mb-3">
                    <input v-model="branchObject.name" type="text" class="form-control" id="floatingInput"
                      placeholder="name@example.com" />
                    <label for="floatingInput">Название</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="branchObject.description" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Описание</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="branchObject.lat" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Широта</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="branchObject.lng" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Долгота</label>
                  </div>
                  <div class="form-floating mb-3">
                    <select v-model="branchObject.parentId" class="form-select" aria-label="Default select example">
                      <option :value="null">Нет родительского отделения</option>
                      <option v-for="branch in desserts" :key="branch.id" :value="branch.id" :disabled="branch.id === branchObject.id ||
                        branchObject.parentId === branch.id ||
                        isChild(branch, branchObject.id)
                        ">
                        {{ branch.name }}
                      </option>
                    </select>
                  </div>
                </form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="isUpdateActive" @click="updateBranch()" text="Изменить"></v-btn>
                <v-btn v-else @click="createBranch()" text="Сохранить"></v-btn>
                <v-btn text="Закрыть" @click="isActive.value = false"></v-btn>
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
              <td>
                {{ item.id }}
              </td>
              <td>
                {{ item.name }}
              </td>
              <td>
                {{ item.description }}
              </td>
              <td>
                {{ item.parentName }}
              </td>
              <td>
                {{ item.lat }}
              </td>
              <td>
                {{ item.lng }}
              </td>
              <td>
                <v-btn class="w-24" fab dark small color="green" @click="show(item.id)">Изменить</v-btn>
              </td>
              <td>
                <v-btn class="w-24" fab dark small color="red" @click="deleteBranch(item.id)">Удалить</v-btn>
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
