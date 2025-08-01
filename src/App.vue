<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuth, SignIn, SignUp } from '@clerk/vue';
import { useRouter } from 'vue-router';

import BottomNav from './components/BottomNav.vue';
import MobileNav from './components/SideDrawer.vue';

const toast = useToast();
const showSignIn = ref(false);
const showSignUp = ref(false);
const isDarkMode = ref(false);
const drawerOpen = ref(false);
const router = useRouter();

const { isSignedIn, user: userRef, isLoaded } = useAuth();
const user = computed(() => userRef?.value);
const signedIn = computed(() => isSignedIn?.value);

// 🧑‍💼 User name fallback
const userName = computed(() => user.value?.firstName ?? 'User');

// 👤 Avatar initials fallback
const userInitials = computed(() => {
  const first = user.value?.firstName?.[0] ?? '';
  const last = user.value?.lastName?.[0] ?? '';
  return (first + last).toUpperCase();
});

// 🌗 Theme toggle
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);

  toast.info(`Switched to ${isDarkMode.value ? 'Dark' : 'Light'} Mode`, {
    timeout: 2000,
    position: 'top-right',
  });
};

// 🌓 Set theme on mount
onMounted(() => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }
});

// 🎉 Redirect after sign-in
watch(signedIn, (val) => {
  if (val && user.value?.firstName) {
    toast.success(`Welcome, ${user.value.firstName}!`, {
      timeout: 3000,
      position: 'top-right',
    });
    showSignIn.value = false;
    router.push('/today');
  }
});

// 👋 Greeting emoji
const greetingEmoji = computed(() => {
  const hour = new Date().getHours();
  return hour < 12 ? '☀️' : hour < 18 ? '👋' : '🌙';
});

const themeIcon = computed(() => (isDarkMode.value ? '🌞' : '🌙'));
</script>

<template>
  <div v-if="isLoaded" class="min-h-screen flex flex-col transition-colors duration-500">
    <!-- 🧭 Header -->
    <header class="flex justify-between items-center p-4 shadow bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div class="flex items-center space-x-3">
        <button @click="drawerOpen = true" class="text-xl">☰</button>
        <router-link v-if="signedIn" to="/profile" class="text-2xl hover:text-blue-600">{{ greetingEmoji }}</router-link>
        <button v-else @click="showSignIn = true" class="text-2xl">👤</button>

        <div class="flex items-center space-x-2">
          <template v-if="signedIn">
            <img
              v-if="user?.imageUrl"
              :src="user.imageUrl"
              class="w-8 h-8 rounded-full object-cover"
              alt="avatar"
            />
            <div v-else class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {{ userInitials }}
            </div>
          </template>
          <p v-if="signedIn">Welcome <strong>{{ userName }}</strong> 🎉</p>
          <p v-else class="italic text-sm text-gray-500 dark:text-gray-400">You’re not signed in.</p>
        </div>
      </div>

      <button @click="toggleTheme" class="text-2xl transition-transform hover:scale-110">
        {{ themeIcon }}
      </button>
    </header>

    <!-- 🔄 Main View -->
    <main class="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <RouterView />
    </main>

    <MobileNav :isOpen="drawerOpen" :isSignedIn="signedIn" @update:isOpen="drawerOpen = $event" />
    <BottomNav />

    <!-- 🔐 Sign-In Modal -->
    <div v-if="showSignIn" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg relative max-w-md w-full">
        <SignIn redirectUrl="/today" />
        <button @click="showSignIn = false" class="absolute top-2 right-3 text-lg text-red-500">×</button>
        <p class="mt-4 text-center">
          No account?
          <button @click="showSignIn = false; showSignUp = true" class="text-blue-600 underline">Sign up</button>
        </p>
      </div>
    </div>

    <!-- 🆕 Sign-Up Modal -->
    <div v-if="showSignUp" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg relative max-w-md w-full">
        <SignUp />
        <button @click="showSignUp = false" class="absolute top-2 right-3 text-lg text-red-500">×</button>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-200">
    Loading authentication...
  </div>
</template>

<style scoped>
main {
  padding-bottom: 64px;
}
</style>