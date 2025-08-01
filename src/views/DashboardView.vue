<template>
  <section class="dashboard">
    <header class="dashboard__header">
      <!-- 👤 Clickable avatar linked to /settings -->
      <router-link to="/settings" class="user-avatar">
        <img :src="user?.imageUrl" alt="User Avatar" class="avatar" />
      </router-link>

      <h1>Welcome, {{ user?.firstName || 'Friend' }} 👋</h1>
      <p class="tagline">Your weekly breakdown & today's snapshot.</p>
    </header>

    <main class="dashboard__main">
      <!-- 🎯 Pie Chart -->
      <div class="card chart-card">
        <h2>🎯 Productivity Stats</h2>
        <canvas ref="pieChart" width="250" height="250"></canvas>
      </div>

      <!-- 📅 Line Chart -->
      <div class="card chart-card">
        <h2>📅 Weekly Progress</h2>
        <canvas ref="lineChart" width="350" height="250"></canvas>
      </div>
    </main>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUser } from '@clerk/vue';
import Chart from 'chart.js/auto';

const { user } = useUser();
const pieChart = ref(null);
const lineChart = ref(null);

onMounted(() => {
  // 🎯 Pie Chart
  new Chart(pieChart.value, {
    type: 'pie',
    data: {
      labels: ['Work', 'Breaks', 'Learning', 'Chill'],
      datasets: [
        {
          data: [40, 20, 25, 15],
          backgroundColor: ['#007cf0', '#00dfd8', '#ff6b6b', '#f9c846'],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          },
        },
      },
    },
  });

  // 📈 Line Chart
  new Chart(lineChart.value, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Hours Worked',
          data: [6, 7.5, 5, 8, 6.5, 4, 2],
          borderColor: '#007cf0',
          backgroundColor: 'rgba(0, 124, 240, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          },
        },
      },
    },
  });
});
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1080px;
  margin: auto;
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
}

.dashboard__header {
  text-align: center;
  margin-bottom: 2rem;
}

.user-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.user-avatar .avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 3px #007cf0;
  transition: transform 0.2s;
}

.user-avatar:hover .avatar {
  transform: scale(1.05);
}

.dashboard__header h1 {
  font-size: 2.5rem;
  font-weight: 600;
  background: linear-gradient(to right, #007cf0, #00dfd8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tagline {
  font-size: 1.1rem;
  color: var(--secondary-text);
}

.dashboard__main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

.chart-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

canvas {
  margin-top: 1rem;
}

:root {
  --text-color: #333;
  --secondary-text: #555;
  --card-bg: #fff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #f2f2f2;
    --secondary-text: #aaa;
    --card-bg: #1e1e1e;
  }
}
</style>