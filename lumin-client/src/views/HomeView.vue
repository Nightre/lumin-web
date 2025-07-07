<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, reactive, ref, watch } from 'vue';
import http from "../utils/http"
import type { IProject } from '@/interface';
import { useRouter } from 'vue-router';

const user = useUserStore()
const userProjects = ref<IProject[]>()
const router = useRouter()

const createProject = async () => {
  const res = await http.post("/projects/create")
  router.push(`/detail/${res.data.project.id}`)
}

const deleteProject = async (id: number) => {
  const confirmDelete = window.confirm("确定要删除这个项目吗？");
  await http.delete("/projects/delete/" + id)
  if (!confirmDelete) return;

  userProjects.value = userProjects.value!.filter(p => p.id !== id);
}

const loadProject = async () => {
  const res = await http.get("/projects/search")
  userProjects.value = res.data
}

watch(() => user.isLogin, () => {
  if (user.isLogin) {
    loadProject()
  }
}, { immediate: true })
</script>

<template>
  <div class="hero mt-3">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">蝾螈馆</h1>
        <p class="py-6">
          继蝾螈池又一新作, 目前该网站正在建设. 不过蝾螈的居民可以开始注册使用已开发功能.
          目前有托管静态网站的功能
        </p>
      </div>
    </div>
  </div>
  <div v-if="user.isLogin">
    <button @click="createProject" class="btn w-full mt-3">创建</button>
    <div class="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="p in userProjects" :key="p.id" class="card p-4 bg-base-100 shadow-sm">
        <router-link :to="`/detail/${p.id}`" class="text-lg font-bold m-0">
          {{ p.name }}
        </router-link>
        <button @click="deleteProject(p.id)" class="btn btn-error btn-sm absolute right-4 top-4">删除</button>
      </div>
    </div>
  </div>
  <p v-else class="text-center">请登录后使用</p>
</template>