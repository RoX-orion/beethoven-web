import './style/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import SvgIcon from "@/components/SvgIcon.vue"
import 'virtual:svg-icons-register';
import { initApp } from '@/lib/init';
import './util/setupServiceWorker';
import pinia from '@/store/store';

init();
async function init() {
	await initApp();
}

const app = createApp(App)

app.use(router)
	.use(pinia)
	.component("SvgIcon", SvgIcon)

app.mount('#app')
