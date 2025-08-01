// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 📦 Lazy-loaded views
const TodayView = () => import('../views/TodayView.vue');
const DashboardView = () => import('../views/DashboardView.vue');
const SettingsView = () => import('../views/SettingsView.vue');
const ProfileView = () => import('../views/ProfileView.vue');

// 🛣️ Route definitions
const routes = [
  { path: '/', redirect: '/today' },
  { path: '/today', name: 'Today', component: TodayView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/settings', name: 'Settings', component: SettingsView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/today' }, // 🧭 Catch-all fallback
];

// 🌐 Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 Clerk-aware navigation guard
router.beforeEach(async (to, from, next) => {
  try {
    await window.Clerk?.load?.(); // Ensure Clerk is ready
    const isSignedIn = Boolean(window.Clerk?.user?.id);

    if (to.meta.requiresAuth && !isSignedIn) {
      next('/today'); // Redirect unauthenticated users
    } else {
      next(); // Allow navigation
    }
  } catch (error) {
    console.error('Navigation error:', error);
    next('/today');
  }
});

export default router;