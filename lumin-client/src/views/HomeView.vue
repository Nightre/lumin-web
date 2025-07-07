<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, reactive, ref } from 'vue';
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

onMounted(async () => {
  const res = await http.get("/projects/search")
  userProjects.value = res.data
})
</script>

<template>
  <div v-for="p in userProjects">
    <router-link :to="`/detail/${p.id}`">{{ p.name }}</router-link>
    <button @click="deleteProject(p.id)">X</button>
  </div>
  <button @click="createProject">创建</button>
</template>
