<script lang="ts" setup>
import type { Ticket } from '../models/tickets/tickets.interface'
import { onMounted, ref, computed } from 'vue'
import { fetchTickets } from '../utils/tickets.utils'

const search = ref('' as string)

const ticketStatusTranslations = {
  NEW: 'Новый',
  BOOKED: 'Бронированный',
  INSERVICE: 'Обслуживающийся',
  COMPLETED: 'Завершенный',
  MISSED: 'Не подошедший',
  ZOMBIE: 'Зомби'
}

const headers = ref([
  { key: 'id', title: 'ID', align: 'center' },
  { key: 'ticketNumber', title: 'Номер билета', align: 'center' },
  { key: 'serviceName', title: 'Название услуги', align: 'center' },
  { key: 'windowNum', title: 'Номер окна', align: 'center' },
  { key: 'branchName', title: 'Отделение', align: 'center' },
  { key: 'registrationTime', title: 'Время регистрации', align: 'center' },
  { key: 'serviceStartTime', title: 'Начало обслуживания', align: 'center' },
  { key: 'serviceEndTime', title: 'Конец обслуживания', align: 'center' },
  { key: 'status', title: 'Статус', align: 'center' },
  { key: 'bookingTime', title: 'Время бронирования', align: 'center' },
  { key: 'bookingCode', title: 'Код бронирования', align: 'center' },
  { key: 'directed', title: 'Перенаправлен', align: 'center' },
  { key: 'redirectedWindowId', title: 'ID перенаправленного окна', align: 'center' },
  { key: 'rating', title: 'Рейтинг', align: 'center' }
])
const desserts = ref([] as Ticket[])

const getRoles = async () => {
  desserts.value = await fetchTickets()
}

const formattedDesserts = computed(() => {
  return desserts.value.map((ticket) => {
    const translatedTicketStatus = ticketStatusTranslations[ticket.status] || ticket.status

    return {
      ...ticket,
      registrationTime: new Date(ticket.registrationTime).toLocaleString('ru-RU'),
      status: translatedTicketStatus,
      serviceStartTime: ticket.serviceStartTime
        ? new Date(ticket.serviceStartTime).toLocaleString('ru-RU')
        : null,
      serviceEndTime: ticket.serviceEndTime
        ? new Date(ticket.serviceEndTime).toLocaleString('ru-RU')
        : null,
      isDirected: ticket.directed ? 'Да' : 'Нет'
    }
  })
})

onMounted(() => {
  getRoles()
  setInterval(() => {
    getRoles()
  }, 3000)
})
</script>

<template>
  <div class="role-container">
    <div class="role-title text-3xl text-center">Билеты</div>
    <div class="role-body w-full">
      <v-card v-if="desserts" flat title="">
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
          :items="formattedDesserts"
          :search="search"
          no-data-text="Данные отсутствуют"
        >
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
