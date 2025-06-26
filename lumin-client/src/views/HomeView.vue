<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/stores/user';

const user = useUserStore()
</script>

<template>
  <NavBar></NavBar>
</template>
