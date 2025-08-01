<script setup>
import { useAuth } from '@clerk/vue';
import { useRouter } from 'vue-router';

const { user, signOut } = useAuth();
const router = useRouter();

const handleSignOut = async () => {
  await signOut();
  router.push('/today');
};
</script>

<template>
  <div class="px-4 py-6 sm:px-6 md:px-8 lg:px-16 max-w-3xl mx-auto">
    <div
      class="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6 transition-all duration-500"
    >
      <!-- 🖼️ Avatar -->
      <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shrink-0">
        <img
          :src="user?.imageUrl"
          alt="User avatar"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- 📄 Profile Info -->
      <div class="flex-1 space-y-3 text-gray-800 dark:text-gray-200">
        <h2 class="text-2xl font-bold">Hi, {{ user.firstName }} 👋</h2>
        <p><strong>Email:</strong> {{ user.emailAddresses[0]?.emailAddress }}</p>
        <p><strong>Username:</strong> {{ user.username || '—' }}</p>

        <button
          @click="handleSignOut"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-500 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ✨ Subtle animation */
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.05);
}
</style>