import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import { vuetify } from './plugins/vuetify'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

// Загружаем данные пользователя из localStorage при старте
const authStore = useAuthStore(pinia)
authStore.loadUserFromStorage()

app.use(router)
app.use(vuetify)

app.mount('#app')
