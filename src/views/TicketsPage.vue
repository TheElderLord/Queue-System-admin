<script setup lang="ts">
import axios from 'axios';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';


import type {Ticket} from "../models/ticket.interface"

const tickets = ref({} as Ticket);

const getRegisteredTickets=async()=>{
    const token = Cookies.get('token');
    const result = await axios.get(`http://localhost:8080/api/v1/tickets/agent/${token}`);
    tickets.value = result.data;
    console.log(result.data);

}  

onMounted(()=>{
    getRegisteredTickets();
})
</script>
<template>
    <div>
        <div v-for="ticket in tickets" :key="ticket.id">
            {{ ticket }}
        </div>
    </div>
</template>