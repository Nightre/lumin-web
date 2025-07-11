<template>
  <header class="bg-white sticky top-0 z-50 border-b-gray-200 border-b-2">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center h-16">
        <img :src="logoImg" alt="" srcset="">
        <!-- Logo / Home -->
        <router-link to="/" class="text-3xl font-semibold ml-2">
          蝾螈馆
        </router-link>
        <div class="flex-1"></div>
        <!-- Right Side -->
        <div class="flex items-center gap-4">
          <template v-if="user.isLogin">
            <p class="text-gray-700 text-sm sm:text-base"><span class="font-medium">{{ user.user?.username }}</span></p>
            <button @click="logout"
              class="text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 text-sm rounded transition">
              退出登录
            </button>
          </template>
          <template v-else>
            <router-link to="/login"
              class="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 text-sm rounded transition">
              登录 / 注册
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import axios from '../utils/http';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import logoImg from "../assets/logo.svg"

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
