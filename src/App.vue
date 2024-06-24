<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponentVue from './components/HeaderComponent.vue'
import SideBarComponent from './components/SideBarComponent.vue'
import type { SideBarLink } from './models/sidebarlink/sidebar.interface'
const links: SideBarLink[] = [
  // {
  //   id: 1,
  //   name: 'Главная',
  //   link: '/',
  //   icon: 'fas fa-home'
  // },
  {
    id: 2,
    name: 'Отделения',
    link: '/',
    icon: 'fas fa-building'
  },
  {
    id: 3,
    name: 'Услуги',
    link: '/services',
    icon: 'fas fa-concierge-bell'
  },
  {
    id: 4,
    name: 'Привязанные услуги',
    link: '/role-services',
    icon: 'fas fa-window-maximize'
  },
  {
    id: 5,
    name: 'Роли',
    link: '/roles',
    icon: 'fas fa-people-arrows'
  },
  {
    id: 6,
    name: 'Операторы',
    link: '/operators',
    icon: 'fas fa-user-tie'
  },
  {
    id: 7,
    name: 'Окна',
    link: '/windows',
    icon: 'fas fa-window-restore'
  },
  {
    id: 8,
    name: 'Сессии',
    link: '/sessions',
    icon: 'fas fa-user-friends'
  },
  {
    id: 9,
    name: 'Билеты',
    link: '/tickets',
    icon: 'fas fa-ticket-alt'
  },
]
</script>

<template>
  <main>
    <div class="sideBar">
      <SideBarComponent :links="links" />
    </div>
    <div class="body">
      <div class="header ">
        <HeaderComponentVue />
      </div>
      <div class="body-container p-4">
        <RouterView />
      </div>
    </div>

  </main>
</template>
<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
  display: flex;

  .sideBar {
    width: 20%;
    height: 100vh;
  }

  .body {
    width: 80%;
    height: 100vh;

    .header {
      width: 100%;
      height: 5vh;
    }

    .body-container {
      width: 100%;

    }


  }
}
</style>
