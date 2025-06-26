import './assets/main.css'
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules';

Object.entries(all).forEach(([name, rule]) => {
  defineRule(name, rule);
});
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, {
  position: POSITION.TOP_CENTER
});
app.mount('#app')
