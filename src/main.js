// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { clerkPlugin } from '@clerk/vue';
import Toast from 'vue-toastification';

import 'vue-toastification/dist/index.css';
import './style.css';

// 🔑 Clerk publishable key from .env
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// 🎉 Create Vue app
const app = createApp(App);

// 🔔 Toast options
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// 🔌 Register plugins
app.use(clerkPlugin, { publishableKey: clerkKey });
app.use(router);
app.use(Toast, toastOptions);

// 🚀 Mount app
app.mount('#app');