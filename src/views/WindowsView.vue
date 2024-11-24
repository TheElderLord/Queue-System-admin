<script lang="ts" setup>
import type { Service } from '../models/services/services.interface';
import type { Window } from '../models/windows/windows.interface'
import { deactiveWindow, fetchWindows, postWindow, putWindow, removeWindow } from '../utils/windows.utils'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { fetchServices } from '../utils/services.utils';
import type { windowServiceModelDtos } from '../models/windows/window-service.interface';
import { postWindowService } from '../utils/window-services.utils';

// const search = ref('' as string)
// const headers = ref([
//   { key: 'id', title: 'ID', align: 'center' },
//   { key: 'name', title: 'Название', align: 'center' },
//   { key: 'description', title: 'Описание', align: 'center' },
//   { key: 'priority', title: 'Приоритет', align: 'center' },
//   { key: 'update', title: 'Изменить', align: 'center' },
//   { key: 'action', title: 'Действие', align: 'center' }
// ])
const desserts = ref([] as Window[] | null);

const services = ref([] as Service[] | null)
const selectedServices = ref([] as windowServiceModelDtos[]);

const selectedService = ref(0 as number);

const isCreateActive = ref<boolean>(false)
const isUpdateActive = ref<boolean>(false)

const windowObject = ref<Window>({
  id: 0,
  branchId: 0,
  branchName: null,
  number: null,
  name: null,
  description: null,
  active: false,
  show: false,
  windowServiceModelDtos: [],
})

const getServices = async () => {
  services.value = await fetchServices();
}

const getWindows = async () => {
  desserts.value = await fetchWindows()
  console.log(desserts.value)
}

const createWindow = async () => {
  if (!windowObject.value.name) {
    alert('Невозможно создать окно без названия')
    return
  }
  // console.log(branchObject.value);
  const role = await postWindow(windowObject.value)
  console.log(selectedServices.value)
  await addServiceToWindow(role.id, selectedServices.value);
  await getWindows()
  isCreateActive.value = false
  resetWindow()
}
const show = async (id: number) => {
  const selectedRole = desserts.value.find((e) => e.id === id)
  // Check if the selected branch is defined
  if (selectedRole) {
    // Assign the found branch to branchObject
    windowObject.value = { ...selectedRole }
    console.log(windowObject.value);
    selectedServices.value = windowObject.value.windowServiceModelDtos;
    windowObject.value.id = id
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
  console.log(windowObject.value)
  await putWindow(windowObject.value.id, windowObject.value)
  await addServiceToWindow(windowObject.value.id, selectedServices.value)
  await getWindows()
  resetWindow()
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
const deactive = async (id: number) => {
  if (confirm("Вы уверены в своих действиях?")) {
    await deactiveWindow(id)
    await getWindows()
  }
}
const resetWindow = () => {
  windowObject.value = {
    id: 0,
    branchId: 0,
    branchName: null,
    number: null,
    name: null,
    description: null,
    active: false,
    show: false,
    windowServiceModelDtos: [],
  }
}
const selectServices = () => {
  const service = services.value.find(s => s.id === selectedService.value);
  console.log(service)
  console.log(selectedServices.value);
  if (service) {
    selectedServices.value.push({
      serviceId: service?.id,
      serviceName: service?.name
    })
  };

  // if (service && !selectedServices.value.some(s => s.id === service.id)) {
  //   selectedServices.value.push({
  //     serviceId: service.id
  //   });
  // }
}
const deleteFromSelected = (id: number) => {
  selectedServices.value = selectedServices.value.filter(e => e.id !== id);

}
const addServiceToWindow = async (id: number | null | undefined, services: windowServiceModelDtos[]) => {
  await postWindowService(id, services)
}
watch(isCreateActive, (newValue) => {
  if (!newValue) {
    resetWindow()
  }
})
onMounted(() => {
  getWindows()
  getServices()
  // setInterval(() => {
  //   getRoles()
  // }, 3000)
})
onUnmounted(() => {
  desserts.value = null;
  services.value = null;
  resetWindow();
})
</script>
<template>
  <div class="role-container">
    <div class="role-title text-3xl text-center">Окна</div>
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
                    <input v-model="windowObject.name" type="text" class="form-control" id="floatingInput"
                      placeholder="name@example.com" />
                    <label for="floatingInput">Название</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="windowObject.description" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Описание</label>
                  </div>
                  <!-- <div class="form-floating mb-3">
                    <input v-model="windowObject.priority" type="text" class="form-control" id="floatingPassword"
                      placeholder="Password" />
                    <label for="floatingPassword">Приоритет</label>
                  </div> -->
                  <div class="form-floating mb-3">
                    <select class="form-select" aria-label="Default select example" v-model="selectedService"
                      @change="selectServices()">
                      <option value="null">Выберите услуги</option>
                      <option v-for="service in services" :key="service.id" :value="service.id">
                        {{ service.name }}
                      </option>
                    </select>
                    <label for="floatingPassword">Услуги</label>
                  </div>
                  <div v-if="selectedServices" class="selects ">
                    <div v-for="sel in selectedServices" :key="sel.id" class="select ">
                      <div @click="deleteFromSelected(sel.id)" class="but"><i class="fas fa-times"></i></div>
                      <div class="title">{{ sel.serviceName }}</div>
                    </div>
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
        <div class="roleService">
          <div class="descr">
            <div class="toggle">

            </div>
            <div class="id">
              ID
            </div>
            <div class="name">
              Название
            </div>
            <div class="description">
              Описание
            </div>
            <div class="description">
              Активен
            </div>
            <!-- <div class="priority">
              {{ windowService.priority }}
            </div> -->
            <div class="change">
              Завершить
            </div>
            <div class="change">
              Изменить
            </div>
            <div class="change">
              Удалить
            </div>
          </div>
        </div>
        <div v-for="windowService in desserts" :key="windowService.id" class="roleService">
          <div class="static">
            <div class="toggle" @click="windowService.show = !windowService.show">
              <i class="fas fa-arrow-down"></i>

            </div>
            <div class="id">
              {{ windowService.id }}
            </div>
            <div class="name">
              {{ windowService.name }}
            </div>
            <div class="description">
              {{ windowService.description }}
            </div>
            <div class="description">
              <i v-if="windowService.active" class="fas fa-circle text-green-500"></i>
              <i v-else class="fas fa-circle text-red-500"></i>
            </div>
            <!-- <div class="priority">
              {{ windowService.priority }}
            </div> -->
            <div class="change">
              <v-btn class="w-28" fab dark small color="green" @click="deactive(windowService.id)">Завершить</v-btn>
            </div>
            <div class="change">
              <v-btn class="w-24" fab dark small color="green" @click="show(windowService.id)">Изменить</v-btn>
            </div>
            <div class="change">
              <v-btn class="w-24" fab dark small color="red" @click="deleteWindow(windowService.id)">Удалить</v-btn>
            </div>
          </div>
          <div v-if="windowService.show" class="hidden-block">
            <div v-for="rs in windowService.windowServiceModelDtos" :key="rs.id" class="hid text-center py-2 text-xl">
              {{ rs.serviceName }}
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

    .static {

      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      width: 100%;
      display: flex;
      text-align: center;
      justify-content: space-between;
      align-content: center;

      border-radius: 1rem;
      font-size: 20px;
      padding: 1.2rem;

      .toggle {
        cursor: pointer;
      }

      div {
        width: 100%;
      }
    }

    .descr {
      width: 100%;
      display: flex;
      text-align: center;
      justify-content: space-between;
      align-content: center;

      border-radius: 1rem;
      font-size: 20px;
      padding: 1rem;

      .toggle {
        cursor: pointer;
      }

      div {
        width: 100%;
      }
    }

    .hidden-block {
      .hid {
        border-radius: 1rem;
        margin: 1rem auto;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        padding: 1.2rem auto;
      }
    }


  }

}
</style>
