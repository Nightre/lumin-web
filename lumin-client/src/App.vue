<script setup lang="ts">
import axios from './utils/http';
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user';
import NavBar from '@/components/NavBar.vue';

const user = useUserStore()
onMounted(async () => {
  try {
    const response = await axios.get("/user/me", { showToast: false })
    user.login(response.data.user)
  } catch (error) {
    user.logout()
  }
})
</script>

<template>
  <NavBar />
  <RouterView />
</template>