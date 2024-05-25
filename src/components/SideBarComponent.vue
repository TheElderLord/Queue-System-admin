<script lang="ts" setup>
import { PropType } from "vue";
import type { SideBarLink } from "../models/sidebarlink/sidebar.interface"
defineProps({
    links: {
        type: Object as PropType<SideBarLink[]>
    }
});
</script>


<template>
    <div class="sidebar-container w-full h-full">
        <div class="navs  w-full h-full py-2">
            <router-link :to="link.link" v-for="link in links" :key="link.id" exact-active-class="active"
                class="nav w-full flex justify-center my-1 py-2">
                <div class="icon my-2 text-3xl text-center w-1/3"> <i :class="link.icon"></i></div>
                <div class="title my-2 text-lg text-start w-2/3">{{ link.name }}</div>
            </router-link>
        </div>

    </div>
</template>
<style lang="scss" scoped>
.sidebar-container {
    background-color: #0F044C;


    .navs {
        .nav {
            background-color: #141E61;

            color: white;


            .icon {}

            .title {}
        }

        .active {
            background-color: #ffcc00;
            /* Change this to the color you want for active state */
            border-radius: 1rem;
            box-shadow: 0 0 15px #ffcc00;
            /* Glowing effect */
        }



        .nav:hover:not(.active) {
            background-color: #787A91;
            border-radius: 1rem;
        }




    }
}
</style>