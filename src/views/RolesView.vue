<script lang="ts" setup>
import type { Service } from '@/models/services/services.interface';
import type { RoleModel } from '../models/role/model.interface'
import { fetchRoles, postRole, putRole, removeRole } from '../utils/role.utils'
import { onMounted, ref, watch } from 'vue'
import { fetchServices } from '@/utils/services.utils';
import type { RoleService } from '@/models/role-services/role-service.interface';
import { postRoleService } from '@/utils/role-services.utils';

const search = ref('' as string)
const headers = ref([
  { key: 'id', title: 'ID', align: 'center' },
  { key: 'name', title: 'Название', align: 'center' },
  { key: 'description', title: 'Описание', align: 'center' },
  { key: 'priority', title: 'Приоритет', align: 'center' },
  { key: 'update', title: 'Изменить', align: 'center' },
  { key: 'action', title: 'Действие', align: 'center' }
])
const desserts = ref([] as RoleModel[]);

const services = ref([] as Service[])
const selectedServices = ref([] as RoleService[]);
const selectedService = ref(0 as number);

const isCreateActive = ref<boolean>(false)
const isUpdateActive = ref<boolean>(false)

const roleObject = ref<RoleModel>({
  id: 0,
  name: '',
  description: '',
  priority: 0,
  roleServices: [],
  show: false
})

const getServices = async () => {
  services.value = await fetchServices();
}

const getRoles = async () => {
  desserts.value = await fetchRoles()
  console.log(desserts.value)
}

const createRole = async () => {
  if (!roleObject.value.name) {
    alert('Невозможно создать роль без названия')
    return
  }
  // console.log(branchObject.value);
  const role = await postRole(roleObject.value)
  console.log(selectedService.value)
  await addServiceToRole(role.id, selectedServices.value);
  await getRoles()
  isCreateActive.value = false
  resetRoleObject()
}
const show = async (id: number) => {
  const selectedRole = desserts.value.find((e) => e.id === id)
  // Check if the selected branch is defined
  if (selectedRole) {
    // Assign the found branch to branchObject
    roleObject.value = { ...selectedRole }
    selectedServices.value = roleObject.value.roleServices;
    roleObject.value.id = id
    isCreateActive.value = true
    isUpdateActive.value = true
  } else {
    console.error(`Role with id ${id} not found.`)
    // Handle the case where the branch is not found, e.g., by showing a notification or error message
  }
}
const close = () => {
  isCreateActive.value = false
  isUpdateActive.value = false
}
const updateRole = async () => {
  console.log(roleObject.value)
  await putRole(roleObject.value.id, roleObject.value)
  await addServiceToRole(roleObject.value.id, selectedServices.value)
  await getRoles()
  resetRoleObject()
  isCreateActive.value = false
  isUpdateActive.value = false
  // console.log(branchObject.value);
}
const deleteRole = async (id: number) => {
  if (confirm("Вы уверены в своих действиях?")) {
    await removeRole(id)
    await getRoles()
  }
}
const resetRoleObject = () => {
  roleObject.value = {
    id: 0,
    name: '',
    description: '',
    priority: 0,
    roleServices: [],
    show: false
  }
}
const selectServices = () => {
  const service = services.value.find(s => s.id === selectedService.value);
  selectedServices.value.push({
    serviceId: service?.id,
    serviceName: service?.name
  })

  // if (service && !selectedServices.value.some(s => s.id === service.id)) {
  //   selectedServices.value.push({
  //     serviceId: service.id
  //   });
  // }
}
const deleteFromSelected = (id: number) => {
  selectedServices.value = selectedServices.value.filter(e => e.id !== id);

}
const addServiceToRole = async (id: number, services: RoleService[]) => {
  await postRoleService(id, services)
}
watch(isCreateActive, (newValue) => {
  if (!newValue) {
    resetRoleObject()
  }
})
onMounted(() => {
  getRoles()
  getServices()
  // setInterval(() => {
  //   getRoles()
  // }, 3000)
})
</script>
<template>
  <div class="role-container">
    <div class="role-title text-3xl text-center">Роли</div>
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
                    <input v-model="roleObject.name" type="text" class="form-control" id="floatingInput"
                      placeholder="name@example.com" />
                    <label for="floatingInput">Название</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="roleObject.description" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Описание</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="roleObject.priority" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Приоритет</label>
                  </div>
                  <div class="form-floating mb-3">
                    <select class="form-select" aria-label="Default select example" v-model="selectedService"
                      @change="selectServices()">
                      <option value="0">Выберите услуги</option>
                      <option v-for="service in services" :key="service.id" :value="service.id">
                        {{ service.parentName + "/" + service.name }}
                      </option>
                    </select>
                    <label for="floatingPassword">Услуги</label>
                  </div>
                  <div v-if="selectedServices" class="selects ">
                    <div v-for="sel in selectedServices" :key="sel.id" class="select ">
                      <div @click="deleteFromSelected(sel.id)" class="but"><i class="fas fa-times"></i></div>
                      <div class="title">{{ sel.parentServiceName + "/" + sel.serviceName }}</div>
                    </div>
                  </div>
                </form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="isUpdateActive" @click="updateRole()" text="Изменить"></v-btn>
                <v-btn v-else @click="createRole()" text="Сохранить"></v-btn>
                <v-btn text="Закрыть" @click="close()"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>
      <!-- <v-card flat title="">
        <template v-slot:text>
          <v-text-field
            v-model="search"
            label="Искать"
            prepend-inner-icon="mdi-magnify"
            single-line
            variant="outlined"
            hide-details
          ></v-text-field>
        </template>

        <v-data-table
          :headers="headers"
          items-per-page-text="Элементов на странице"
          :items="desserts"
          :search="search"
          no-data-text="Данные отсутствуют"
        >
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
                {{ item.priority }}
              </td>
              <td>
                <v-btn class="w-24" fab dark small color="red" @click="show(item.id)"
                  >Изменить</v-btn
                >
              </td>
              <td>
                <v-btn class="w-24" fab dark small color="red" @click="deleteRole(item.id)"
                  >Удалить</v-btn
                >
              </td>
            </tr>
             <v-btn class="w-24" fab dark small color="green"  @click="update(item.id)">Изменить</v-btn> 
          </template>
        </v-data-table>
      </v-card> -->
      <div class="roleServices">
        <!-- <div class=roleService>
            <div class="id">
              ID
            </div>
            <div class="name">
             Название
            </div>
            <div class="description">
              Описание
            </div>
            <div class="priority">
              Приоритет
            </div>
          </div> -->
        <div v-for="roleService in desserts" :key="roleService.id" class="roleService">
          <div class="static">
            <div class="toggle" @click="roleService.show = !roleService.show">
              <i class="fas fa-arrow-down"></i>

            </div>
            <div class="id">
              {{ roleService.id }}
            </div>
            <div class="name">
              {{ roleService.name }}
            </div>
            <div class="description">
              {{ roleService.description }}
            </div>
            <div class="priority">
              {{ roleService.priority }}
            </div>
            <div class="change">
              <v-btn class="w-24" fab dark small color="green" @click="show(roleService.id)">Изменить</v-btn>
            </div>
            <div class="change">
              <v-btn class="w-24" fab dark small color="red" @click="deleteRole(roleService.id)">Удалить</v-btn>
            </div>
          </div>
          <div v-if="roleService.show" class="hidden-block">
            <div v-for="rs in roleService.roleServices" :key="rs.id" class="hid text-center py-2 text-xl">
              {{ rs.parentServiceName + "/" + rs.serviceName }}
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>
<style lang="scss" scoped>
tr,
td {
  text-align: center;
}

.selects {
  width: 100%;
  display: flex;
  overflow-x: scroll;

  .select {
    cursor: pointer;
    width: fit-content;
    padding: 0.2rem;
    margin: .3rem;
    border-radius: .3rem;
    color: white;
    background-color: gray;
    display: flex;

    .title {
      color: white;
    }

    .but {
      cursor: pointer;
    }

  }
}

.roleServices {
  margin: 1rem auto;
  width: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .roleService {
    width: 100%;

    background-color: rgb(245, 245, 245);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    .static {
      width: 100%;
      display: flex;
      text-align: center;
      justify-content: space-between;
      align-content: center;

      border-radius: .5rem;
      font-size: 20px;

      .toggle {
        cursor: pointer;
      }

      div {
        width: 100%;
      }
    }

    .hidden-block {
      .hid {
        border: 1px solid black
      }
    }


  }

}
</style>
