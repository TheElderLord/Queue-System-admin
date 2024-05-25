<script lang="ts" setup>
import type { RoleModel } from "../models/role/model.interface"
import { fetchRoles } from "../utils/role.utils";
import { onMounted, ref } from "vue"

const search = ref("" as string);
const headers = ref([
    { key: "name", title: "Назвиние", align: "center", },
    { key: "description", title: "Описание", align: "center" },
    { key: "priority", title: "Приоритет", align: "center" },
    { key: "action", title: "Действие", align: "center" },


]);
const desserts = ref([] as RoleModel[]);


const getRoles = async () => {
    desserts.value = await fetchRoles();
    console.log(desserts.value)

}
onMounted(() => {
    getRoles()
})
</script>
<template>

    <div class="role-container">
        <div class="role-title text-3xl text-center">Роли</div>
        <div class="role-body w-full">
            <v-card flat title="">

                <template v-slot:text>
                    <v-text-field v-model="search" label="Искать" prepend-inner-icon="mdi-magnify" single-line
                        variant="outlined" hide-details></v-text-field>
                </template>

                <v-data-table :headers="headers" :items="desserts" :search="search">
                    <template v-slot:item="{ item }">
                        <tr>

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
                                <v-btn class="w-24" fab dark small color="red"
                                    @click="deleteUserFun(item.id)">Удалить</v-btn>
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
