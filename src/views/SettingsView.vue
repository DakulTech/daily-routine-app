<template>
  <section class="settings">
    <!-- 👤 Profile Settings -->
    <div class="card">
      <h2>👤 Profile Info</h2>
      <img :src="previewImage || user?.imageUrl" alt="Avatar" class="avatar" />

      <input v-model="firstName" placeholder="First Name" class="form-input" />

      <label class="form-label">Update Avatar</label>
      <input type="file" accept="image/*" @change="handleImageUpload" class="form-input" />

      <button @click="saveProfile" class="btn">💾 Save Profile</button>
    </div>

    <!-- 🔔 Notification Settings -->
    <div class="card">
      <h2>🔔 Notifications</h2>
      <label class="toggle">
        <input type="checkbox" v-model="notifications.email" />
        <span>Email Alerts</span>
      </label>
      <label class="toggle">
        <input type="checkbox" v-model="notifications.weeklyReport" />
        <span>Weekly Summary</span>
      </label>
    </div>

    <!-- 🌗 Theme Switch -->
    <div class="card">
      <h2>🌗 Theme</h2>
      <select v-model="theme" @change="applyTheme" class="form-input">
        <option value="light">Light Mode</option>
        <option value="dark">Dark Mode</option>
      </select>
    </div>

    <!-- 🔓 Danger Zone -->
    <div class="card danger-zone">
      <h2>⚠️ Account Actions</h2>
      <button @click="logout" class="btn secondary">Logout</button>
      <button @click="confirmDelete" class="btn danger">Delete Account</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUser, useClerk } from '@clerk/vue';

const { user } = useUser();
const clerk = useClerk();

const firstName = ref(user?.firstName || '');
const previewImage = ref(null);
const uploadedFile = ref(null);

const notifications = ref({
  email: true,
  weeklyReport: false
});

const theme = ref('light');
const applyTheme = () => {
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
};

// 📸 Handle Image Upload Preview
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    uploadedFile.value = file;
  }
};

// 💾 Save profile changes
const saveProfile = async () => {
  try {
    await user.update({ firstName: firstName.value });
    console.log('✅ First name updated');

    if (uploadedFile.value) {
      await user.setProfileImage({ file: uploadedFile.value });
      console.log('🖼️ Avatar uploaded');
      previewImage.value = null;
      uploadedFile.value = null;
    }
  } catch (err) {
    console.error('❌ Failed to update profile:', err);
  }
};

// 🔓 Logout
const logout = () => {
  clerk.signOut();
};

// 💥 Confirm Delete
const confirmDelete = async () => {
  const confirmed = confirm('Are you sure you want to delete your account permanently?');
  if (confirmed) {
    try {
      await user.delete();
      console.log('🧨 Account deleted');
      logout();
    } catch (err) {
      console.error('❌ Deletion failed:', err);
    }
  }
};

onMounted(() => {
  applyTheme();
});
</script>

<style scoped>
.settings {
  max-width: 640px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
}

.card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(6px);
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  margin: 1rem 0;
  box-shadow: 0 0 0 3px #00dfd8;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.6rem;
}

.form-label {
  margin-top: 1rem;
  font-weight: 600;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  font-weight: 500;
}

.btn {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(to right, #007cf0, #00dfd8);
  color: white;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn:hover {
  transform: scale(1.05);
}

.btn.secondary {
  background: #444;
}

.btn.danger {
  background: #e63946;
}

.danger-zone {
  border: 1px solid #e63946;
}

:root {
  --text-color: #333;
  --card-bg: #fff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #eee;
    --card-bg: #1c1c1c;
  }
}
</style>