<script lang="ts" setup>
import type { TicketStatusTimeOut } from '@/models/tickets/ticketsStatusTimeOut.interface';
import { fetchTicketStatus, postTicketStatus, putTicketStatus, removeTicketStatus } from '@/utils/ticketStatusTime.utils';
import { computed, onMounted, ref, watch } from 'vue'


const search = ref('' as string)
const isCreateActive = ref<boolean>(false)
const isUpdateActive = ref<boolean>(false)

interface StatusObject{
     id:number,
     translate:string
     value:string
}

const ticketStatusObject = ref<TicketStatusTimeOut>({
    id: 0,
    fromStatus: "",
    hour: 0,
    toStatus: "",
})

const StatusTranslations: Record<string, StatusObject> = {
  NEW: { id:0, translate:"Новый",value:"NEW"},
  MISSED: {id:1, translate:"Не подошедший",value:"MISSED"},
  INSERVICE:{ id:2,translate:"В обслуживании",value:"INSERVICE"},
  COMPLETED: {id:3, translate:"Завершен",value:"COMPLETED"}
}

const headers = ref([
    { key: 'id', title: 'ID', align: 'center' },
    { key: 'ticketStatus', title: 'Со статуса', align: 'center' },
    { key: 'hour', title: 'Время(час)' , align: 'center' },
    { key: 'toStatus', title: 'В статус', align: 'center' },
    { key: 'action', title: 'Изменить', align: 'center' },
    { key: 'delete', title: 'Удалить', align: 'center' },

])

const desserts = ref([] as TicketStatusTimeOut[])



const getTicketStatuses = async () => {
    desserts.value = await fetchTicketStatus()
}



const isValidTicketStatusForm = (): boolean => {
    return (
        !!ticketStatusObject.value.fromStatus &&
        !!ticketStatusObject.value.toStatus &&
        ticketStatusObject.value.hour !== 0
    )
}

const createTicketStatusTimeOut = async () => {
    console.log(ticketStatusObject.value)
    // if (
    //     ticketStatusObject.value.ticketStatus &&
    //     ticketStatusObject.value.toStatus &&
    //     ticketStatusObject.value.hour !== 0
    // ) {

    //     alert('Пожалуйста, заполните все обязательные поля ')
    //     return
    // }

    await postTicketStatus(ticketStatusObject.value)
    await getTicketStatuses()
    isCreateActive.value = false
    resetOperatorObject()
}

const show = async (id: number) => {
    const selectedTicketStatus = desserts.value.find((e) => e.id === id)
    if (selectedTicketStatus) {
        ticketStatusObject.value = { ...selectedTicketStatus }
        ticketStatusObject.value.id = id
        isCreateActive.value = true
        isUpdateActive.value = true
    } else {
        console.error(`Ticket status with id ${id} not found.`)
    }
}

const close = () => {
    isCreateActive.value = false
    isUpdateActive.value = false
}

const updateOperator = async () => {
    // if (
    //     ticketStatusObject.value.ticketStatus &&
    //     ticketStatusObject.value.toStatus &&
    //     ticketStatusObject.value.hour !== 0
    // ) {
    //     console.log(ticketStatusObject.value)
    //     alert('Пожалуйста, заполните все обязательные поля')
    //     return
    // }

    await putTicketStatus(ticketStatusObject.value.id, ticketStatusObject.value)
    await getTicketStatuses()
    resetOperatorObject()
    isCreateActive.value = false
    isUpdateActive.value = false
}

const deleteTicketStatus = async (id: number) => {
    if (confirm("Вы уверены в своих действиях?")) {
        await removeTicketStatus(id)
        await getTicketStatuses()
    }

}

const resetOperatorObject = () => {
    ticketStatusObject.value = {
        id: 0,
        fromStatus: "",
        hour: 0,
        toStatus: "",
    }
}

watch(isCreateActive, (newValue) => {
    if (!newValue) {
        resetOperatorObject()
    }
})

onMounted(() => {
    getTicketStatuses()

    setInterval(() => {
        getTicketStatuses()
    }, 10000)
})
</script>

<template>
    <div class="role-container">
        <div class="role-title text-3xl text-center">Статусы</div>
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
                                        <select v-model="ticketStatusObject.fromStatus" class="form-select" aria-label="Default select example">
                                            <option value="null"  selected>Выберите со статус</option>
                                            <option :value="status.value" v-for="status in StatusTranslations" :key="status.id">
                                              {{ status.translate }}
                                            </option>
                                          </select>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input v-model="ticketStatusObject.hour" type="text" class="form-control"
                                            id="floatingPassword" placeholder="Password" />
                                        <label for="floatingPassword">Время(час)</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <select v-model="ticketStatusObject.toStatus" class="form-select" aria-label="Default select example">
                                            <option value="null"  selected>Выберите в статус</option>
                                            <option :value="status.value" v-for="status in StatusTranslations" :key="status.id">
                                              {{ status.translate }}
                                            </option>
                                          </select>
                                    </div>
                                   
                                </form>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn v-if="isUpdateActive" :disabled="!isValidTicketStatusForm()"
                                    @click="updateOperator()" text="Изменить"></v-btn>
                                <v-btn v-else :disabled="!isValidTicketStatusForm()"
                                    @click="createTicketStatusTimeOut()" text="Сохранить"></v-btn>
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

                <v-data-table :headers="headers" items-per-page-text="Элементов на странице" :items="desserts"
                    :search="search" no-data-text="Данные отсутствуют">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.id }}</td>
                            <td>{{ StatusTranslations[item.fromStatus].translate }}</td>
                            <td>{{ item.hour }}</td>
                            <td>{{ StatusTranslations[item.toStatus].translate }}</td>
                           
                            <td>
                                <v-btn class="w-24" fab dark small color="green" @click="show(item.id)">Изменить</v-btn>
                            </td>
                            <td>
                                <v-btn class="w-24" fab dark small color="red"
                                    @click="deleteTicketStatus(item.id)">Удалить</v-btn>
                            </td>
                        </tr>
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
