<script setup lang="ts">
import axios from './axios';
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user';

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
  <RouterView />
</template>