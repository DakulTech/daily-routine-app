<template>
  <div class="today-view">
    <h1 class="text-2xl font-bold mb-4">🗓️ Today's Routine</h1>

    <!-- Date Picker -->
    <input
      type="date"
      v-model="selectedDate"
      @change="fetchTasks"
      class="mb-4 px-3 py-2 border rounded"
    />

    <!-- Progress Tracker -->
    <div v-if="tasks.length" class="mb-4">
      <p class="text-sm text-gray-600">
        {{ completedCount }} of {{ tasks.length }} tasks completed
      </p>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-green-500 h-2 rounded-full"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- Add Task Button -->
    <button @click="openModal" class="bg-blue-600 text-white px-4 py-2 rounded">
      ➕ Add Task
    </button>

    <!-- No Tasks Message -->
    <div v-if="tasks.length === 0" class="mt-4 text-gray-500">
      No tasks yet. Add one!
    </div>

    <!-- Task List -->
    <div class="task-list mt-4 space-y-2">
      <RoutineCard
        v-for="(task, index) in tasks"
        :key="task.id"
        :task="task"
        @toggle="toggleComplete(index)"
        @delete="deleteTask(index)"
        draggable="true"
        @dragstart="startDrag(index)"
        @drop.prevent="onDrop(index)"
        @dragover.prevent
        :class="priorityClass(task.priority)"
      />
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <input
        ref="titleInput"
        v-model="newTask.title"
        placeholder="Task title"
        class="mb-2 px-3 py-2 border rounded w-full"
      />
      <input
        v-model="newTask.time"
        placeholder="Time (e.g. 8:00 AM)"
        class="mb-2 px-3 py-2 border rounded w-full"
      />
      <select v-model="newTask.priority" class="mb-2 px-3 py-2 border rounded w-full">
        <option disabled value="">Priority</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <input
        v-model="newTask.iconType"
        placeholder="Icon (e.g. 🧘)"
        class="mb-2 px-3 py-2 border rounded w-full"
      />
      <button @click="addTask" class="bg-green-600 text-white px-4 py-2 rounded mr-2">
        Add
      </button>
      <button @click="showModal = false" class="bg-gray-400 text-white px-4 py-2 rounded">
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import RoutineCard from '../components/RoutineCard.vue'
import { supabase } from '../supabaseClient'
import { useAuth } from '@clerk/vue'

const { user } = useAuth()

const tasks = ref([])
const showModal = ref(false)
const dragIndex = ref(null)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const newTask = ref({
  title: '',
  time: '',
  completed: false,
  priority: '',
  iconType: ''
})

const userId = ref(null)

onMounted(async () => {
  if (!user?.value?.id) return
  userId.value = user.value.id
  await fetchTasks()
})

async function fetchTasks() {
  const { data, error } = await supabase
    .from('daily-routine-app')
    .select('*')
    .eq('user_id', userId.value)
    .eq('date', selectedDate.value)
    .order('position', { ascending: true })

  if (error) {
    console.error('Error fetching tasks:', error)
  } else {
    tasks.value = data
  }
}

function openModal() {
  showModal.value = true
  nextTick(() => {
    titleInput?.value?.focus()
  })
}

async function addTask() {
  if (!newTask.value.title || !newTask.value.time) return

  const position = tasks.value.length
  const newEntry = {
    ...newTask.value,
    user_id: userId.value,
    position,
    date: selectedDate.value
  }

  const { data, error } = await supabase
    .from('daily-routine-app')
    .insert([newEntry])
    .select()

  if (error) {
    console.error('Add task failed:', error)
    return
  }

  tasks.value.push(data[0])
  newTask.value = {
    title: '',
    time: '',
    completed: false,
    priority: '',
    iconType: ''
  }
  showModal.value = false
}

async function toggleComplete(index) {
  const task = tasks.value[index]
  task.completed = !task.completed

  await supabase
    .from('daily-routine-app')
    .update({ completed: task.completed })
    .eq('id', task.id)
}

async function deleteTask(index) {
  const task = tasks.value[index]
  await supabase.from('daily-routine-app').delete().eq('id', task.id)
  tasks.value.splice(index, 1)
}

async function onDrop(dropIndex) {
  const dragged = tasks.value[dragIndex.value]
  tasks.value.splice(dragIndex.value, 1)
  tasks.value.splice(dropIndex, 0, dragged)

  for (let i = 0; i < tasks.value.length; i++) {
    tasks.value[i].position = i
    await supabase
      .from('daily-routine-app')
      .update({ position: i })
      .eq('id', tasks.value[i].id)
  }
}

function startDrag(index) {
  dragIndex.value = index
}

function priorityClass(priority) {
  return {
    'border-l-4 border-green-500': priority === 'Low',
    'border-l-4 border-yellow-500': priority === 'Medium',
    'border-l-4 border-red-500': priority === 'High'
  }
}

const completedCount = computed(() => tasks.value.filter(t => t.completed).length)
const progressPercent = computed(() =>
  tasks.value.length ? (completedCount.value / tasks.value.length) * 100 : 0
)
</script>

<style scoped>
.today-view {
  padding: 1rem;
}
.task-list {
  margin-top: 1rem;
}
.modal {
  position: fixed;
  top: 20%;
  left: 30%;
  background: white;
  padding: 1rem;
  border: 1px solid #ccc;
  z-index: 10;
  width: 300px;
}
</style>