<script setup>
import { useAuth } from '@clerk/vue'
import { computed } from 'vue'

const { isSignedIn } = useAuth()

const dashboardRoute = computed(() =>
  isSignedIn === true ? '/dashboard' : '/profile'
)
const dashboardIcon = computed(() =>
  isSignedIn === true ? '📊' : '👤'
)
const dashboardLabel = computed(() =>
  isSignedIn === true ? 'Dashboard' : 'Profile'
)

// Play notification sound
function playNotification() {
  const audio = new Audio('/ding.mp3')
  audio.play().catch(() => {
    console.warn('ding.mp3 not found or failed to play')
  })
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t z-50 backdrop-blur-md">
    <ul class="flex justify-around py-2 text-sm text-gray-500 dark:text-gray-400">
      <li>
        <router-link to="/today" class="flex flex-col items-center hover:text-blue-600 transition">
          🏠
          <span>Home</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-if="isSignedIn !== null"
          :to="dashboardRoute"
          class="flex flex-col items-center hover:text-blue-600 transition"
        >
          {{ dashboardIcon }}
          <span>{{ dashboardLabel }}</span>
        </router-link>

        <span v-else class="flex flex-col items-center text-gray-400">
          ⏳
          <span>Loading</span>
        </span>
      </li>

      <li>
        <router-link
          to="/notifications"
          class="flex flex-col items-center relative hover:text-blue-600 transition"
          @click="playNotification"
        >
          🔔
          <span>Alerts</span>
          <span class="absolute top-0 right-3 h-2 w-2 bg-red-500 rounded-full"></span>
        </router-link>
      </li>

      <li>
        <router-link to="/settings" class="flex flex-col items-center hover:text-blue-600 transition">
          ⚙️
          <span>Settings</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  backdrop-filter: blur(12px);
}
</style>