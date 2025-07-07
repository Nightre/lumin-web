import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { IProject } from '@/interface'

export const useProjectStore = defineStore('project', () => {
  const project = ref<IProject>()

  return {
    project
  }
})
