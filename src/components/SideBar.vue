<template>
  <KeepAlive>
    <n-drawer v-model:show="store.isDrawerOpen" placement="left" :show-mask="isShrink" :trap-focus="false"
      :mask-closable="isShrink" :z-index="100" width="320px">
      <KeepAlive>
        <SideBarContent />
      </KeepAlive>
    </n-drawer>
  </KeepAlive>
</template>

<script setup lang="ts">
import SideBarContent from "./SideBarContent.vue"
import { lt800px as isShrink } from "@/utils/Responsive"
import store from '@/store';
import { watch, onMounted } from "vue";

onMounted(() => { store.isDrawerOpen = !isShrink.value })
watch(isShrink, (prev) => {
  store.isDrawerOpen = !isShrink.value
  console.debug(store.isDrawerOpen)
})
</script>