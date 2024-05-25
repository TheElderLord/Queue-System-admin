<script lang="ts" setup>
import type { RoleService } from "../models/role-services/role-service.interface"
import { onMounted, ref } from "vue"
import { fetchRoleServices } from "../utils/role-services.utils";

const search = ref("" as string);
const headers = ref([
    { key: "serviceName", title: "Название", align: "center", },
    { key: "branchName", title: "Описание", align: "center" },
    { key: "roleName", title: "Родитель", align: "center" },
    { key: "action", title: "Действие", align: "center" },


]);
const desserts = ref([] as RoleService[]);


const getRoles = async () => {
    desserts.value = await fetchRoleServices();
    // console.log(desserts.value)

}
onMounted(() => {
    getRoles()
})
</script>
<template>

    <div class="role-container">
        <div class="role-title text-3xl text-center">Привязанные услуги</div>
        <div class="role-body w-full">

            <v-card v-if="desserts" flat title="">

                <template v-slot:text>
                    <v-text-field v-model="search" label="Искать" prepend-inner-icon="mdi-magnify" single-line
                        variant="outlined" hide-details></v-text-field>
                </template>

                <v-data-table :headers="headers" :items="desserts" :search="search">
                    <template v-slot:item="{ item }">
                        <tr>
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
