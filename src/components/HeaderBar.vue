<template>
  <n-element class="headerBar">
    <FlexAside>
      <template #left>
        <n-space horizantal style="display: flex; align-items: center;">
          <n-button circle quaternary @click="openDrawer"
            style="--n-width: 48px; --n-height: 48px; --n-icon-size: 24px;" :disabled="props.disabled">
            <template #icon>
              <n-icon>
                <menu-filled />
              </n-icon>
            </template>
          </n-button>
          <h2 style="color: var(--text-color-base); height: 100%">
            {{ props.title }}
          </h2>
        </n-space>
      </template>
      <template #right v-if="!props.disabled">
        <n-space :align="'center'">
          <n-popover trigger="hover">
            <template #trigger>
              <n-button circle quaternary style="--n-width: 48px; --n-height: 48px; --n-icon-size: 24px;"
                @click="router.push('/schedule')">
                <template #icon>
                  <n-icon>
                    <EditCalendarFilled />
                  </n-icon>
                </template>
              </n-button>
            </template>
            <span>编辑时间</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-popconfirm>
                <template #trigger>
                  <n-button>
                    {{ Auth.user.value?.username || "Who Are You?" }}
                  </n-button>
                </template>
                真的要退出登录吗?
                <template #action>
                  <n-button size="small" @click="logout" type="primary">
                    确认
                  </n-button>
                </template>
              </n-popconfirm>
            </template>
            <span>退出登录</span>
          </n-popover>
        </n-space>
      </template>
    </FlexAside>
  </n-element>

  <div style="position: relative; height: calc(100vh - 64px)">
    <slot></slot>
  </div>
</template>

<style scoped>
.headerBar {
  background-color: var(--base-color);
  padding: 8px 32px;
  height: 64px;

  width: 100vw;
  z-index: 1000;
  position: relative;

  box-shadow: var(--box-shadow-1);
}

.headerBar>div {
  display: flex;
  align-items: center;
}

@media (prefers-color-scheme: light) {
  .headerBar {
    background-color: var(--primary-color-hover);
  }

  .headerBar * {
    color: #fff !important;
  }
}
</style>

<script setup lang="ts">
import MenuFilled from "@vicons/material/MenuFilled"
import store from '@/store';
import Auth from "@/utils/Auth"
import FlexAside from "@/components/FlexAside.vue"
import { useRouter } from "vue-router"
import EditCalendarFilled from "@vicons/material/EditCalendarFilled"

const router = useRouter()

const openDrawer = () => {
  store.isDrawerOpen = !store.isDrawerOpen
  console.debug(store.isDrawerOpen)
}

const props = defineProps({
  title: String,
  disabled: {
    type: Boolean,
    default: false
  }
})

const logout = () => {
  Auth.logout()
  router.push("/login")
}
</script>