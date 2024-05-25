<script lang="ts" setup>
import type { Operator } from "../models/operators/operator.inteface"
import { onMounted, ref } from "vue"
import { fetchOperators } from "../utils/operators.utils";

const search = ref("" as string);
const headers = ref([
    { key: "id", title: "ID", align: "center", },
    { key: "name", title: "Имя", align: "center", },
    { key: "lastname", title: "Фамилия", align: "center" },
    { key: "roleName", title: "Роль", align: "center" },
    { key: "active", title: "Активен", align: "center" },
    { key: "action", title: "Действие", align: "center" },


]);
const desserts = ref([] as Operator[]);


const getRoles = async () => {
    desserts.value = await fetchOperators();
    // console.log(desserts.value)

}
onMounted(() => {
    getRoles()
})
</script>
<template>

    <div class="role-container">
        <div class="role-title text-3xl text-center">Операторы</div>
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
                                {{ item.id }}
                            </td>
                            <td>
                                {{ item.name }}
                            </td>
                            <td>
                                {{ item.lastname }}
                            </td>
                            <td>
                                {{ item.roleName }}
                            </td>
                            <td>
                                {{ item.active }}
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
