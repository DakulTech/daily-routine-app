<!-- src/views/NotFoundView.vue -->
<template>
  <div class="not-found">
    <h1>404 – Page Not Found</h1>
    <p>We looked everywhere, but couldn’t find that page.</p>
    <router-link to="/">🔙 Go back home</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView',
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
}

h1 {
  font-size: 3rem;
  color: #e63946;
}

p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

a {
  font-size: 1rem;
  color: #457b9d;
  text-decoration: underline;
}
</style>