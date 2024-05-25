// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import './index.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

import '@fortawesome/fontawesome-free/js/all'


const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)
app.use(vuetify);

app.use(createPinia())
app.use(router)

app.mount('#app')
