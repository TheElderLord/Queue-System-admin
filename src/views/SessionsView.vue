<script lang="ts" setup>
import type { Session } from "../models/sessions/session.inteface"
import { onMounted, ref, computed } from "vue"
import { fetchSessions } from "../utils/sessions.utils";


const search = ref("" as string);
const headers = ref([
    { key: "id", title: "ID", align: "center", },
    { key: "branchName", title: "Отделение", align: "center", },
    { key: "windowName", title: "Окно", align: "center", },
    { key: "windowNumber", title: "Номер окна", align: "center" },
    { key: "operatorName", title: "Оператор", align: "center" },
    { key: "status", title: "Статус", align: "center" },
    { key: "startTime", title: "Начало", align: "center" },
    { key: "endTime", title: "Конец", align: "center" },
    { key: "working-time", title: "Время", align: "center" },
    { key: "active", title: "Активен", align: "center" },
    { key: "action", title: "Действие", align: "center" },


]);
const desserts = ref([] as Session[]);


const getRoles = async () => {
    desserts.value = await fetchSessions();
    // console.log(desserts.value)
}
const formatTimeDifference = (startTime: string, endTime: string | null) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();

    if (diffMs < 0) {
        return "00:00:00"; // This means the start time is in the future relative to the end time (should not happen)
    }

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`;
}


const formattedDesserts = computed(() => {
    return desserts.value.map(ticket => {
        const workingTime = formatTimeDifference(ticket.startTime, ticket.endTime);
        return {
            ...ticket,
            startTime: new Date(ticket.startTime).toLocaleString("ru-RU"),
            endTime: ticket.endTime ? new Date(ticket.endTime).toLocaleString("ru-RU") : null,
            workingTime: workingTime,
            status: ticket.status === "ONNLINE" ? "В сети" : "Оффлайн",
            active: ticket.active === true ? "Да" : "Нет"
        };
    })
    //   .sort((a, b) => {
    //     return a.startTime - b.starttime;
    //   });
});
onMounted(() => {
    getRoles()
    setInterval(() => {
        desserts.value = [...desserts.value]; // Trigger reactivity for computed property
    }, 1000);

    setInterval(() => {
        getRoles()
    }, 3000)

})
</script>
<template>

    <div class="role-container">
        <div class="role-title text-3xl text-center">Сессии</div>
        <div class="role-body w-full">

            <v-card v-if="desserts" flat title="">

                <template v-slot:text>
                    <v-text-field v-model="search" label="Искать" prepend-inner-icon="mdi-magnify" single-line
                        variant="outlined" hide-details></v-text-field>
                </template>

                <v-data-table :headers="headers" :items="formattedDesserts" :search="search">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>
                                {{ item.id }}
                            </td>
                            <td>
                                {{ item.branchName }}
                            </td>
                            <td>
                                {{ item.windowName }}
                            </td>
                            <td>
                                {{ item.windowNumber }}
                            </td>
                            <td>
                                {{ item.operatorName }}
                            </td>
                            <td>
                                {{ item.status }}
                            </td>
                            <td>
                                {{ item.startTime }}
                            </td>
                            <td>
                                {{ item.endTime }}
                            </td>
                            <td>
                                {{ item.workingTime }}
                            </td>
                            <td>
                                <i v-if="item.active" class="fas fa-circle text-green-500"></i>
                                <i v-else class="fas fa-circle text-red-500"></i>
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
