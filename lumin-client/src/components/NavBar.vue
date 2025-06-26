<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import axios from '../axios';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";

const toast = useToast()
const router = useRouter()
const user = useUserStore()
const logout = () => {
  axios.post("logout")
  user.logout()
  router.push("/")
  toast.success("退出登录成功")
}
</script>

<template>
  <div v-if="user.isLogin">
    <p>{{ user.user!.username }}</p>
    <button @click="logout">退出登录</button>
  </div>
  <div v-else>
    <router-link to="/login">登录/注册</router-link>
  </div>
</template>
