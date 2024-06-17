<script lang="ts" setup>
import type { RoleModel } from "../models/role/model.interface"
import { fetchRoles, postRole, putRole, removeRole } from "../utils/role.utils";
import { onMounted, ref, watch } from "vue"

const search = ref("" as string);
const headers = ref([
    { key: "id", title: "ID", align: "center", },
    { key: "name", title: "Название", align: "center", },
    { key: "description", title: "Описание", align: "center" },
    { key: "priority", title: "Приоритет", align: "center" },
    { key: "update", title: "Изменить", align: "center" },
    { key: "action", title: "Действие", align: "center" },

]);
const desserts = ref([] as RoleModel[]);


const isCreateActive = ref<boolean>(false);
const isUpdateActive = ref<boolean>(false);

const roleObject = ref<RoleModel>({
    id: 0,
    name: "",
    description: "",
    priority: 0
});


const getRoles = async () => {
    desserts.value = await fetchRoles();
    console.log(desserts.value)

}

const createRole = async () => {
    // console.log(branchObject.value);
    await postRole(roleObject.value);
    getRoles();
    isCreateActive.value = false;
    resetRoleObject();
}
const show = async (id: number) => {
    const selectedRole = desserts.value.find(e => e.id === id);
    // Check if the selected branch is defined
    if (selectedRole) {
        // Assign the found branch to branchObject
        roleObject.value = { ...selectedRole };
        roleObject.value.id = id;
        isCreateActive.value = true;
        isUpdateActive.value = true;
    } else {
        console.error(`Role with id ${id} not found.`);
        // Handle the case where the branch is not found, e.g., by showing a notification or error message
    }
}
const close = () => {
    isCreateActive.value = false;
    isUpdateActive.value = false;
}
const updateRole = async () => {
    console.log(roleObject.value);
    await putRole(roleObject.value.id, roleObject.value);
    await getRoles();
    resetRoleObject();
    isCreateActive.value = false;
    isUpdateActive.value = false;
    // console.log(branchObject.value);

}
const deleteRole = async (id: number) => {
    await removeRole(id);
    await getRoles();
}
const resetRoleObject = () => {
    roleObject.value = {
        id: 0,
        name: "",
        description: "",
        priority: 0
    };
}
watch(isCreateActive, (newValue) => {
    if (!newValue) {
        resetRoleObject();
    }
});
onMounted(() => {
    getRoles()
    setInterval(() => {
        getRoles()
    }, 3000)
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
                                        <input v-model="roleObject.name" type="text" class="form-control"
                                            id="floatingInput" placeholder="name@example.com" />
                                        <label for="floatingInput">Название</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input v-model="roleObject.description" type="text" class="form-control"
                                            id="floatingPassword" placeholder="Password" />
                                        <label for="floatingPassword">Описание</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input v-model="roleObject.priority" type="text" class="form-control"
                                            id="floatingPassword" placeholder="Password" />
                                        <label for="floatingPassword">Приоритет</label>
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
            <v-card flat title="">

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
                                {{ item.name }}
                            </td>
                            <td>
                                {{ item.description }}
                            </td>
                            <td>
                                {{ item.priority }}
                            </td>
                            <td>
                                <v-btn class="w-24" fab dark small color="red" @click="show(item.id)">Изменить</v-btn>
                            </td>
                            <td>
                                <v-btn class="w-24" fab dark small color="red"
                                    @click="deleteRole(item.id)">Удалить</v-btn>
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
