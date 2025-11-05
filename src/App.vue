<script setup lang="ts">
import Navbar from './components/commons/Navbar.vue'
import Footer from './components/commons/Footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-grow p-4">
      <h1 class="">You did it!</h1>
      <p>
        Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
        documentation
      </p>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
/* Styles are handled by Tailwind CSS classes */
</style>
