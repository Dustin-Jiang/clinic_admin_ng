<template>
  <n-config-provider :theme="theme">
    <n-modal-provider>
      <n-dialog-provider>
        <n-message-provider>
          <HeaderBar title="BITNP 电脑诊所">
            <MainView>
              <RouterView />
            </MainView>
          </HeaderBar>
        </n-message-provider>
      </n-dialog-provider>
    </n-modal-provider>
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
  theme.value = isDark.value === "dark" ? darkTheme : lightTheme;
})
</script>