<script setup lang="ts">
import { computed, defineProps, useAttrs } from 'vue';

const props = defineProps<{
  label: string;
  errors?: string;
}>();

const inputClasses = computed(() => ({
  'border-red-500': !!props.errors,
}));
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">{{ label }}</legend>
    <slot :inputClasses="inputClasses"></slot>
    <p v-if="errors" class="text-red-500 text-sm label">{{ errors }}</p>
  </fieldset>
</template>