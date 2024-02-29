<template>
  <n-config-provider :theme="theme">
    <HeaderBar title="BITNP电脑诊所">
      <n-message-provider>
        <MainView>
          <RouterView />
        </MainView>
      </n-message-provider>
    </HeaderBar>
  </n-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { darkTheme, lightTheme } from "naive-ui"
import { ref, watch } from "vue"
import { useOsTheme as useDark } from "naive-ui"

import MainView from './views/MainView.vue'

const isDark = useDark()
const theme = ref<typeof darkTheme | typeof lightTheme>(isDark.value === "dark" ? darkTheme : lightTheme)

watch(isDark, (val) => {
  console.debug(val)
  console.debug(theme)
  theme.value = val ? darkTheme : lightTheme;
})
</script>