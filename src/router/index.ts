import { createRouter, createWebHistory } from 'vue-router'
import RoleView from '@/views/RolesView.vue'
import OperatorsView from '@/views/OperatorsView.vue'
import WindowsView from '@/views/WindowsView.vue'
import SessionsView from '@/views/SessionsView.vue'
import TicketsView from '@/views/TicketsView.vue'
// import HomeView from '@/views/HomeView.vue'
import BranchesView from '@/views/BranchesView.vue'
import ServicesView from '@/views/ServicesView.vue'
import BindedServicesView from '@/views/BindedServicesView.vue'
import TicketStatusTimeOut from '@/views/TicketStatusTimeOut.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/',
      name: 'branches',
      component: BranchesView
    },
    {
      path: '/roles',
      name: 'roles',
      component: RoleView
    },
    {
      path: '/services',
      name: 'services',
      component: ServicesView
    },
    {
      path: '/operators',
      name: 'operators',
      component: OperatorsView
    },
    {
      path: '/windows',
      name: 'windows',
      component: WindowsView
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionsView
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: TicketsView
    },
    {
      path: '/role-services',
      name: 'role-services',
      component: BindedServicesView
    },
    {
      path: '/timeout',
      name: 'timeout',
      component: TicketStatusTimeOut
    }
  ]
})

export default router
