<template>
  <main>
    <SideBar />
    <n-element :style="{
      // when PERSISTENT drawer is opened
      width: (store.isDrawerOpen && !lt800px) ? 'calc(100vw - 320px)' : '100vw',
      marginLeft: (store.isDrawerOpen && !lt800px) ? '320px' : '0',
      position: 'relative',
      height: 'calc(100vh - 64px)',
      transitionDuration: '300ms',
      overflow: 'auto'
    }">
      <slot></slot>
    </n-element>
  </main>
</template>

<script setup lang="ts">
import SideBar from "@/components/SideBar.vue"
import store from "@/store"
import { lt800px } from "@/utils/Responsive"
</script>
