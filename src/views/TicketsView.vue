<script lang="ts" setup>
import type { Ticket } from "../models/tickets/tickets.interface"
import { onMounted, ref, computed } from "vue"
import { fetchTickets } from "../utils/tickets.utils";


const search = ref("" as string);
const headers = ref([

    { key: "id", title: "ID", align: "center" },
    { key: "ticketNumber", title: "Номер билета", align: "center" },
    { key: "serviceName", title: "Название услуги", align: "center" },
    { key: "windowNum", title: "Номер окна", align: "center" },
    { key: "branchName", title: "Отделение", align: "center" },
    { key: "registrationTime", title: "Время регистрации", align: "center" },
    { key: "serviceStartTime", title: "Начало обслуживания", align: "center" },
    { key: "serviceEndTime", title: "Конец обслуживания", align: "center" },
    { key: "status", title: "Статус", align: "center" },
    { key: "bookingTime", title: "Время бронирования", align: "center" },
    { key: "bookingCode", title: "Код бронирования", align: "center" },
    { key: "directed", title: "Направлен", align: "center" },
    { key: "redirectedWindowId", title: "ID перенаправленного окна", align: "center" },
    { key: "rating", title: "Рейтинг", align: "center" },
    { key: "action", title: "Действие", align: "center" }

]);
const desserts = ref([] as Ticket[]);


const getRoles = async () => {
    desserts.value = await fetchTickets();
    // console.log(desserts.value)
}
const formattedDesserts = computed(() => {
    return desserts.value.map((ticket) => ({
        ...ticket,
        registrationTime: new Date(ticket.registrationTime).toLocaleString('ru-RU'),
        serviceStartTime: ticket.serviceStartTime ? new Date(ticket.serviceStartTime).toLocaleString('ru-RU') : null,
        serviceEndTime: ticket.serviceEndTime
            ? new Date(ticket.serviceEndTime).toLocaleString('ru-RU')
            : null,
        status: ticket.status === 'ONLINE' ? 'В сети' : 'Оффлайн',
        isDirected: ticket.directed ? 'Да' : 'Нет',
    }));
});
onMounted(() => {
    getRoles()
})
</script>
<template>

    <div class="role-container">
        <div class="role-title text-3xl text-center">Билеты</div>
        <div class="role-body w-full">

            <v-card v-if="desserts" flat title="">

                <template v-slot:text>
                    <v-text-field v-model="search" label="Искать" prepend-inner-icon="mdi-magnify" single-line
                        variant="outlined" hide-details></v-text-field>
                </template>

                <v-data-table :headers="headers" :items="formattedDesserts" :search="search">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.id }}</td>
                            <td>{{ item.ticketNumber }}</td>
                            <td>{{ item.serviceName }}</td>
                            <td>{{ item.windowNum }}</td>
                            <td>{{ item.branchName }}</td>
                            <td>{{ item.registrationTime }}</td>
                            <td>{{ item.serviceStartTime }}</td>
                            <td>{{ item.serviceEndTime }}</td>
                            <td>{{ item.status }}</td>
                            <td>{{ item.bookingTime }}</td>
                            <td>{{ item.bookingCode }}</td>
                            <td>{{ item.isDirected }}</td>
                            <td>{{ item.redirectedWindowId }}</td>
                            <td>{{ item.rating }}</td>
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
