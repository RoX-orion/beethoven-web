import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import SvgIcon from "@/components/SvgIcon.vue"
import 'virtual:svg-icons-register';

const app = createApp(App)

app.use(router)
	.component("SvgIcon", SvgIcon)

app.mount('#app')
