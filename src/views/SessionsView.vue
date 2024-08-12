<script lang="ts" setup>
import type { Session } from '../models/sessions/session.inteface'
import { onMounted, ref, computed } from 'vue'
import { deleteRequest, fetchSessions, stopASession } from '../utils/sessions.utils'

const search = ref('' as string)

const sessionStatusTranslations: Record<string, string> = {
  ONNLINE: 'В сети',
  BREAK: 'Перерыв',
  FORCED: 'Принудительно',
  TECHNICAL_PROBLEMS: 'Технические проблемы',
  COMPLETED: 'Завершено'
}

const headers = ref([
  { key: 'id', title: 'ID', align: 'center' },
  { key: 'branchName', title: 'Отделение', align: 'center' },
  { key: 'windowName', title: 'Окно', align: 'center' },
  { key: 'windowNumber', title: 'Номер окна', align: 'center' },
  { key: 'operatorName', title: 'Оператор', align: 'center' },
  { key: 'status', title: 'Статус', align: 'center' },
  { key: 'startTime', title: 'Начало', align: 'center' },
  { key: 'endTime', title: 'Конец', align: 'center' },
  { key: 'working-time', title: 'Время', align: 'center' },
  { key: 'active', title: 'Активен', align: 'center' },
  { key: 'action', title: 'Действия', align: 'center' },
  { key: 'delete', title: 'Удалить', align: 'center' }
])

const desserts = ref([] as Session[])

const getSessions = async () => {
  desserts.value = await fetchSessions()
}

const formatTimeDifference = (startTime: string, endTime: string | null) => {
  const start = new Date(startTime)
  const end = endTime ? new Date(endTime) : new Date()
  const diffMs = end.getTime() - start.getTime()

  if (diffMs < 0) {
    return '00:00:00' // This means the start time is in the future relative to the end time (should not happen)
  }

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000)

  return `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`
}
const stop = async (id: number) => {
  if (confirm("Вы уверены в своих действиях?")) {
    await stopASession(id)
    await getSessions()
  }
}

const formattedDesserts = computed(() => {
  return desserts.value.map((ticket) => {

    const workingTime = formatTimeDifference(ticket.startTime, ticket.endTime)

    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
    }

    const translatedStatus = sessionStatusTranslations[ticket.status] || ticket.status

    return {
      ...ticket,
      startTime: formatDate(new Date(ticket.startTime)),
      status: translatedStatus,
      endTime: ticket.endTime ? formatDate(new Date(ticket.endTime)) : null,
      workingTime: workingTime
    }
  })
})
const deleteSession = async (id: number) => {
  if (confirm("Вы уверены в своих действиях?")) {
    await deleteRequest(id);
    await getSessions();
  }
}

onMounted(() => {
  getSessions()
  // setInterval(() => {
  //   desserts.value = [...desserts.value] // Trigger reactivity for computed property
  // }, 1000)

  setInterval(() => {
    getSessions()
  }, 10000)
})
</script>

<template>
  <div class="role-container">
    <div class="role-title text-3xl text-center">Сессии</div>
    <div class="role-body w-full">
      <v-card v-if="desserts" flat title="">
        <template v-slot:text>
          <v-text-field v-model="search" label="Искать" prepend-inner-icon="mdi-magnify" single-line variant="outlined"
            hide-details></v-text-field>
        </template>

        <v-data-table :headers="headers" items-per-page-text="Элементов на странице" :items="formattedDesserts"
          :search="search" no-data-text="Данные отсутствуют">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.branchName }}</td>
              <td>{{ item.windowName }}</td>
              <td>{{ item.windowNumber }}</td>
              <td>{{ item.operatorName }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.startTime }}</td>
              <td>{{ item.endTime }}</td>
              <td>{{ item.workingTime }}</td>
              <td>
                <i v-if="item.active" class="fas fa-circle text-green-500"></i>
                <i v-else class="fas fa-circle text-red-500"></i>
              </td>
              <td>
                <button @click="stop(item.id)" class="btn btn-primary">Завершить сессию</button>
              </td>
              <td>
                <button @click="deleteSession(item.id)" class="btn btn-primary">Удалить</button>
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
