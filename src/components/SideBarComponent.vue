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
    <div class="layout">
        <div class="sidebar-container">
            <div class="navs py-2">
                <router-link :to="link.link" v-for="link in links" :key="link.id" exact-active-class="active"
                    class="nav flex justify-center my-1 py-2">
                    <div class="icon my-2 text-3xl text-center w-1/3"> <i :class="link.icon"></i></div>
                    <div class="title my-2 text-lg text-start w-2/3">{{ link.name }}</div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout {
    display: flex;
    height: 100vh;
}

.sidebar-container {
    width: 20%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #141E61;
    overflow: hidden;

    .navs {
        height: 100%;
        overflow-y: auto;

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

.content-container {
    margin-left: 250px; /* Задает отступ для основного контента, чтобы он начинался после sidebar */
    width: calc(100% - 250px);
    height: 100vh;
    overflow-y: auto;
    padding: 20px;
}
</style>
