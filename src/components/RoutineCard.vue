<template>
  <div
    ref="card"
    class="flex items-center justify-between px-4 py-4 mb-4 rounded-xl bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 transform"
    :class="swipeClasses"
  >
    <!-- Icon + Task Info -->
    <div class="flex items-center gap-3">
      <component
        :is="currentIcon"
        class="w-6 h-6 cursor-pointer transition hover:scale-105"
        :class="iconColor"
        aria-hidden="true"
        @click="iconClicked"
      />
      <div>
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ time }}</p>
      </div>
    </div>

    <!-- Priority Badge + Completion Toggle -->
    <div class="flex items-center gap-3">
      <span
        v-if="priority"
        :class="badgeClasses"
        class="text-xs font-semibold px-2 py-1 rounded-full transition"
      >
        {{ priority }}
      </span>
      <button
        @click="toggleComplete"
        :aria-pressed="completed"
        class="w-8 h-8 flex items-center justify-center rounded-full border-2 transition hover:scale-105 focus:outline-none"
        :class="completed
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'"
        aria-label="Toggle complete"
      >
        <span v-if="completed" class="text-base font-bold">✓</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useSwipe } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
  title: String,
  time: String,
  completed: Boolean,
  priority: String,
  iconType: String,
  index: Number
})

const emit = defineEmits(['update:completed', 'delete-task'])

const card = ref(null)
const toast = useToast()
const swipeDirection = ref(null)

const { direction } = useSwipe(card, { threshold: 80 })

watch(direction, (dir) => {
  swipeDirection.value = dir
  if (dir === 'left') {
    emit('update:completed', !props.completed)
  }
  if (dir === 'right') {
    emit('delete-task', props.index)
    toast.info(`🗑️ Deleted "${props.title}"`, { timeout: 2000 })
  }
})

const swipeClasses = computed(() => {
  if (swipeDirection.value === 'left') return 'scale-[0.97] opacity-70'
  if (swipeDirection.value === 'right') return 'opacity-0 translate-x-full'
  return ''
})

const currentIcon = computed(() => {
  switch (props.iconType?.toLowerCase()) {
    case 'clock':
      return ClockIcon
    case 'alert':
      return ExclamationTriangleIcon
    default:
      return CheckCircleIcon
  }
})

const iconColor = computed(() =>
  props.completed
    ? 'text-green-500 dark:text-green-400'
    : 'text-blue-500 dark:text-blue-400'
)

const badgeClasses = computed(() => {
  const colors = {
    High: 'bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100',
    Medium: 'bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-50',
    Low: 'bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100'
  }
  return colors[props.priority] || 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
})

const toggleComplete = () => {
  emit('update:completed', !props.completed)
}

const iconClicked = () => {
  if (props.iconType === 'alert') {
    toast.warning(`⚠️ ${props.title} (${props.priority})`, { timeout: 3000 })
  }
}
</script>

<style scoped>
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 191, 139, 0.5);
}
</style>