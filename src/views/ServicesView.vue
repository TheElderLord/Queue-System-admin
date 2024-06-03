<script lang="ts" setup>
import type { Service } from "../models/services/services.interface"
import { onMounted, ref, watch } from "vue"
import { fetchServices, postService, putService, removeService } from "../utils/services.utils";

const search = ref("" as string);
const headers = ref([
    { key: "id", title: "ID", align: "center", },
    { key: "name", title: "Название", align: "center", },
    { key: "description", title: "Описание", align: "center" },
    { key: "parentName", title: "Родитель", align: "center" },
    { key: "maxWaitTime", title: "Максимальное время ожидания", align: "center" },
    { key: "maxServTime", title: "Максимальное время обслуживания", align: "center" },
    { key: "priority", title: "Приоритет", align: "center" },
    { key: "action", title: "Изменить", align: "center" },
    { key: "action", title: "Действие", align: "center" },


]);
const desserts = ref([] as Service[]);
const isCreateActive = ref<boolean>(false);
const isUpdateActive = ref<boolean>(false);

const serviceObject = ref<Service>({
    id: 0,
    name: "",
    description: "",
    parentName: "",
    priority: 0,
    parentId: null,
    maxServTime:null,
    maxWaitTime:null
});


const getServices = async () => {
    desserts.value = await fetchServices();
    console.log(desserts.value)
}
const createService = async () => {
    // console.log(branchObject.value);
    await postService(serviceObject.value);
    getServices();
    isCreateActive.value = false;
    resetServiceObject();
}
const show = async (id: number) => {
    const selectedRole = desserts.value.find(e => e.id === id);
    // Check if the selected branch is defined
    if (selectedRole) {
        // Assign the found branch to branchObject
        serviceObject.value = { ...selectedRole };
        serviceObject.value.id = id;
        isCreateActive.value = true;
        isUpdateActive.value = true;
    } else {
        console.error(`Service with id ${id} not found.`);
        // Handle the case where the branch is not found, e.g., by showing a notification or error message
    }
}
const close = () => {
    isCreateActive.value = false;
    isUpdateActive.value = false;
}
const updateService = async () => {
    console.log(serviceObject.value);
    await putService(serviceObject.value.id, serviceObject.value);
    await getServices();
    resetServiceObject();
    isCreateActive.value = false;
    isUpdateActive.value = false;
    // console.log(branchObject.value);

}
const deleteService = async (id: number) => {
    await removeService(id);
    await getServices();
}
const resetServiceObject = () => {
    serviceObject.value = {
        id: 0,
        name: "",
        description: "",
        parentName: "",
        priority: 0,
        parentId: null,
        maxServTime:null,
        maxWaitTime:null
    };
}
watch(isCreateActive, (newValue) => {
    if (!newValue) {
        resetServiceObject();
    }
});
onMounted(() => {
    getServices()
    setInterval(() => {
        getServices()
    }, 3000)
})
</script>
<template>

    <div class="role-container">
        <div class="role-title text-3xl text-center">Услуги</div>
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
                                        <input v-model="serviceObject.name" type="text" class="form-control"
                                            id="floatingInput" placeholder="name@example.com" />
                                        <label for="floatingInput">Название</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input v-model="serviceObject.description" type="text" class="form-control"
                                            id="floatingPassword" placeholder="Password" />
                                        <label for="floatingPassword">Описание</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <select v-model="serviceObject.parentId" class="form-select"
                                            aria-label="Default select example">
                                            <option value="0" selected>Выберите родительскую услугу</option>
                                            <option :value="parent.id" v-for="parent in desserts" :key="parent.id">
                                                {{ parent.name }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input v-model="serviceObject.maxServTime" type="text" class="form-control"
                                            id="floatingPassword" placeholder="Password" />
                                        <label for="floatingPassword">Максимальное время обслуживания</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input v-model="serviceObject.maxWaitTime" type="text" class="form-control"
                                            id="floatingPassword" placeholder="Password" />
                                        <label for="floatingPassword">Максимальное время ожидания</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input v-model="serviceObject.priority" type="text" class="form-control"
                                            id="floatingPassword" placeholder="Password" />
                                        <label for="floatingPassword">Приоритет</label>
                                    </div>

                                </form>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn v-if="isUpdateActive" @click="updateService()" text="Изменить"></v-btn>
                                <v-btn v-else @click="createService()" text="Сохранить"></v-btn>
                                <v-btn text="Закрыть" @click="close()"></v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>
            </div>
            <v-card flat title="">

                <template v-slot:text>
                    <v-text-field v-model="search" label="Искать" prepend-inner-icon="mdi-magnify" single-line
                        variant="outlined" hide-details></v-text-field>
                </template>

                <v-data-table :headers="headers" :items="desserts" :search="search">
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
                                {{ item.maxWaitTime }}
                            </td>
                            <td>
                                {{ item.maxServTime }}
                            </td>
                            <td>
                                {{ item.priority }}
                            </td>
                            <td>
                                <v-btn class="w-24" fab dark small color="red" @click="show(item.id)">Изменить</v-btn>
                            </td>
                            <td>
                                <v-btn class="w-24" fab dark small color="red"
                                    @click="deleteService(item.id)">Удалить</v-btn>
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
