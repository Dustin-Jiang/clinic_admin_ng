<template>
  <n-element style="padding: 12px 48px 48px; max-width: 1600px; margin: 0 auto;">
    <n-button text @click="() => goBack()" :disabled="!canBack">
      <template #icon>
        <ArrowBackFilled />
      </template>
      返回
    </n-button>
    <n-h1 prefix="bar" style="margin-top: 0.5rem">
      {{ props.title }}
    </n-h1>

    <slot></slot>
  </n-element>
</template>

<script setup lang="ts">
import ArrowBackFilled from '@vicons/material/ArrowBackFilled';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  title: string
}>()

const router = useRouter()

const canBack = computed(() => {
  return window.history.state.back !== null
})

const goBack = () => {
  if (canBack.value) router.back()
}
</script>