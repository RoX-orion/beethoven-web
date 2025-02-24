import './style/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import SvgIcon from "@/components/SvgIcon.vue"
import 'virtual:svg-icons-register';
import { initApp } from '@/lib/init';
import './util/setupServiceWorker';
import pinia from '@/store/store';
// import { PiniaVuePlugin } from 'pinia';
// import './router/RouteGuard';

init();
async function init() {
	await initApp();
}

const app = createApp(App)

app.use(router)
	// .use(PiniaVuePlugin)
	.use(pinia)
	.component("SvgIcon", SvgIcon)

app.mount('#app')
