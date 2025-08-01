<template>
  <transition name="slide">
    <aside
      v-if="isOpen"
      class="fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-900 shadow-lg overflow-auto"
    >
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Navigation</h2>
        <button @click="closeDrawer" class="text-gray-500 hover:text-red-500 text-lg">✖</button>
      </div>
      <ul class="p-4 space-y-4 text-gray-700 dark:text-gray-300">
        <li>
          <router-link
            to="/today"
            class="block hover:text-blue-600 transition"
            @click.native="closeDrawer"
          >
            📅 Today
          </router-link>
        </li>
        <li v-if="isSignedIn !== null">
          <router-link
            :to="isSignedIn ? '/dashboard' : '/profile'"
            class="block hover:text-blue-600 transition"
            @click.native="closeDrawer"
          >
            {{ isSignedIn ? '📊 Dashboard' : '🧑 Profile' }}
          </router-link>
        </li>
        <li>
          <router-link
            to="/settings"
            class="block hover:text-blue-600 transition"
            @click.native="closeDrawer"
          >
            ⚙️ Settings
          </router-link>
        </li>
        <li v-if="isSignedIn">
          <router-link
            to="/profile"
            class="block hover:text-blue-600 transition"
            @click.native="closeDrawer"
          >
            🧑 Profile
          </router-link>
        </li>
        <li v-if="isSignedIn">
          <button @click="handleSignOut" class="block text-red-500 hover:underline transition">
            🚪 Sign Out
          </button>
        </li>
      </ul>
    </aside>
  </transition>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    isSignedIn: Boolean,
  },
  methods: {
    closeDrawer() {
      this.$emit("update:isOpen", false);
    },
    handleSignOut() {
      this.$emit("sign-out");
      this.closeDrawer();
    },
  },
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>