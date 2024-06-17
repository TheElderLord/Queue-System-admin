<script lang="ts" setup>
import type { RoleService } from "../models/role-services/role-service.interface"
import { onMounted, ref, watch } from "vue"
import { fetchRoleServices, postRoleService, putRoleService, removeRoleService } from "../utils/role-services.utils";
import type { Branch } from "@/models/branches/branches.interface";
import type { Service } from "@/models/services/services.interface";
import type { RoleModel } from "@/models/role/model.interface";
import { fetchBranches } from "@/utils/branches.utils";
import { fetchServices } from "@/utils/services.utils";
import { fetchRoles } from "@/utils/role.utils";

const search = ref("" as string);
const headers = ref([
    { key: "id", title: "ID", align: "center", },
    { key: "serviceName", title: "Название", align: "center", },
    { key: "branchName", title: "Отделение", align: "center" },
    { key: "roleName", title: "Роль", align: "center" },
    { key: "action", title: "Изменить", align: "center" },
    { key: "action", title: "Действие", align: "center" },


]);
const desserts = ref([] as RoleService[]);
const branches = ref([] as Branch[]);
const services = ref([] as Service[]);
const roles = ref([] as RoleModel[]);

const isCreateActive = ref<boolean>(false);
const isUpdateActive = ref<boolean>(false);

const RoleServiceObject = ref<RoleService>({
    id: 0,
    branchId: 0,
    branchName: "",
    roleId: 0,
    roleName: "",
    serviceId: 0,
    serviceName: "",
});

const getBranches = async () => {
    branches.value = await fetchBranches();
}
const getServices = async () => {
    services.value = await fetchServices();
}
const getRoles = async () => {
    roles.value = await fetchRoles();
}

const getRoleServices = async () => {
    desserts.value = await fetchRoleServices();
}
const createRoleService = async () => {
    // console.log(branchObject.value);
    await postRoleService(RoleServiceObject.value);
    getRoleServices();
    isCreateActive.value = false;
    resetRoleServiceObject();
}
const show = async (id: number) => {
    const selectedRoleService = desserts.value.find(e => e.id === id);
    // Check if the selected branch is defined
    if (selectedRoleService) {
        // Assign the found branch to branchObject
        RoleServiceObject.value = { ...selectedRoleService };
        RoleServiceObject.value.id = id;
        isCreateActive.value = true;
        isUpdateActive.value = true;
    } else {
        console.error(`RoleService with id ${id} not found.`);
        // Handle the case where the branch is not found, e.g., by showing a notification or error message
    }
}
const close = () => {
    isCreateActive.value = false;
    isUpdateActive.value = false;
}
const updateRoleService = async () => {
    console.log(RoleServiceObject.value);
    await putRoleService(RoleServiceObject.value.id, RoleServiceObject.value);
    await getRoleServices();
    resetRoleServiceObject();
    isCreateActive.value = false;
    isUpdateActive.value = false;
    // console.log(branchObject.value);

}
const deleteRoleService = async (id: number) => {
    await removeRoleService(id);
    await getRoleServices();
}
const resetRoleServiceObject = () => {
    RoleServiceObject.value = {
        id: 0,
        branchId: 0,
        branchName: "",
        roleId: 0,
        roleName: "",
        serviceId: 0,
        serviceName: "",
    };
}
watch(isCreateActive, (newValue) => {
    if (!newValue) {
        resetRoleServiceObject();
    }
});

onMounted(() => {
    getRoleServices();
    getBranches();
    getServices();
    getRoles();
    // setInterval(() => {
    //     getRoleServices();
    //     getBranches();
    //     getServices();
    //     getRoles();
    // }, 3000)
})
</script>
<template>

    <div class="role-container">
        <div class="role-title text-3xl text-center">Привязанные услуги</div>
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
                                    <!-- <div class="form-floating mb-3">
                                        <input v-model="RoleServiceObject.serviceName" type="text" class="form-control"
                                            id="floatingInput" placeholder="name@example.com" />
                                        <label for="floatingInput">Название</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input v-model="RoleServiceObject.branchName" type="text" class="form-control"
                                            id="floatingPassword" placeholder="Password" />
                                        <label for="floatingPassword">Номер</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input v-model="RoleServiceObject.roleName" type="text" class="form-control"
                                            id="floatingPassword" placeholder="Password" />
                                        <label for="floatingPassword">Описание</label>
                                    </div> -->

                                    <div class="form-floating mb-3">
                                        <select v-model="RoleServiceObject.serviceId" class="form-select"
                                            aria-label="Default select example">
                                            <option value="0" selected>Выберите услугу</option>
                                            <option :value="service.id" v-for="service in services" :key="service.id">
                                                {{ service.name }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <select v-model="RoleServiceObject.branchId" class="form-select"
                                            aria-label="Default select example">
                                            <option value="0" selected>Выберите Отделение</option>
                                            <option :value="branch.id" v-for="branch in branches" :key="branch.id">
                                                {{ branch.name }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <select v-model="RoleServiceObject.roleId" class="form-select"
                                            aria-label="Default select example">
                                            <option value="0" selected>Выберите роль</option>
                                            <option :value="role.id" v-for="role in roles" :key="role.id">
                                                {{ role.name }}
                                            </option>
                                        </select>
                                    </div>

                                </form>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn v-if="isUpdateActive" @click="updateRoleService()" text="Изменить"></v-btn>
                                <v-btn v-else @click="createRoleService()" text="Сохранить"></v-btn>
                                <v-btn text="Закрыть" @click="close()"></v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>
            </div>

            <v-card v-if="desserts" flat title="">

                <template v-slot:text>
                    <v-text-field v-model="search" label="Искать" prepend-inner-icon="mdi-magnify" single-line
                        variant="outlined" hide-details></v-text-field>
                </template>

                <v-data-table  :headers="headers"
                    items-per-page-text="Элементов на странице"
                    :items="formattedDesserts"
                    :search="search"
                    no-data-text="Данные отсутствуют">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>
                                {{ item.id }}
                            </td>
                            <td>
                                {{ item.serviceName }}
                            </td>
                            <td>
                                {{ item.branchName }}
                            </td>
                            <td>
                                {{ item.roleName }}
                            </td>
                            <td>
                                <v-btn class="w-24" fab dark small color="red" @click="show(item.id)">Изменить</v-btn>
                            </td>
                            <td>
                                <v-btn class="w-24" fab dark small color="red"
                                    @click="deleteRoleService(item.id)">Удалить</v-btn>
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
