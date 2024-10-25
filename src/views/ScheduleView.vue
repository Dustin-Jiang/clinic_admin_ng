<template>
    <n-element style="padding: 12px 48px 48px; max-width: 1600px; margin: 0 auto;">
      <n-h1 prefix="bar" align-text style="margin-top: 0.5rem">
        服务时间管理
      </n-h1>

      <div v-if="Object.keys(dateGroup.groups).length > 0">
        <n-tabs v-for="(list, idx) in dateGroup" :key="idx" animated>
          <n-tab-pane v-for="(items, date) in list" :name="date" :tab="date" :key="date">
            <n-grid cols="1 600:2" :x-gap="8" :y-gap="8">
              <n-grid-item v-for="item in items" :key="item.url">
                <n-card>
                  <n-thing :title="item.campus" :title-extra="item.title"
                    :description="`${item.startTime} - ${item.endTime}`">
                    <n-space justify="space-between">
                      <n-space>
                        <n-button size="small" secondary>
                          {{ `已预约 ${item.count} / ${item.capacity}` }}
                        </n-button>
                        <n-button size="small" secondary>
                          {{ `已完成 ${item.finish} / ${item.capacity}` }}
                        </n-button>
                      </n-space>
                      <n-dropdown trigger="hover" :options="options" @select="(key: string) => handleSelect(key, item)">
                        <n-button size="small">
                          操作
                        </n-button>
                      </n-dropdown>
                    </n-space>
                  </n-thing>
                </n-card>
              </n-grid-item>
            </n-grid>
          </n-tab-pane>
        </n-tabs>
      </div>
      <n-empty v-else />
    </n-element>

    <n-float-button :right="16" :bottom="24" type="primary" :width="144" :height="56"
      @click="() => router.push('/schedule/add')">
      <div style="display: flex; gap: 8px; flex-direction: row; align-items: center; justify-content: center; ">
        <n-icon :size="24">
          <playlist-add-filled />
        </n-icon>
        <span style="font-size: 0.8rem;">新建服务时间</span>
      </div>
    </n-float-button>
</template>

<script lang="ts" setup>
import Api from '@/utils/Api';
import type API from "@/store/api";
import store from "@/store";
import { onMounted, reactive, h } from 'vue';
import type { Component } from 'vue';
import { NIcon, useDialog, useMessage } from 'naive-ui';
import PlaylistAddFilled from '@vicons/material/PlaylistAddFilled';
import { useRouter } from 'vue-router';
import EditFilled from '@vicons/material/EditFilled';
import DeleteFilled from '@vicons/material/DeleteFilled';
import ClearFilled from '@vicons/material/ClearFilled';

const router = useRouter();

const dateGroup = reactive({
  groups: {} as { [k: string]: API.DateStatus[] }
});

onMounted(async () => {
  const res = await Api.get<API.DateStatus[]>('/api/date/');
  store.dateList = res.data;
  console.debug("dateList", store.dateList);

  res.data.forEach((item) => {
    const date = item.date;
    if (!dateGroup.groups[date]) {
      dateGroup.groups[date] = [];
    }
    dateGroup.groups[date].push(item);
  });

  console.debug("dateGroup", dateGroup.groups);
})

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const options = [
  {
    label: "编辑",
    key: "edit",
    icon: renderIcon(EditFilled)
  },
  {
    label: "删除",
    key: "delete",
    icon: renderIcon(DeleteFilled)
  },
  {
    label: "清空",
    key: "clear",
    icon: renderIcon(ClearFilled)
  }
]

const dialog = useDialog();
const message = useMessage();

const handleSelect = (key: string, item: API.DateStatus) => {
  if (key === "delete") {
    dialog.warning({
      title: '警告',
      content: '确定删除吗？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: async () => {
        Api.delete(`${item.url.replace(/.*\/api/g, '/api')}`);
        message.success('确定')
      },
      onNegativeClick: () => {}
    })
  }
  if (key === "clear") {
    dialog.warning({
      title: '警告',
      content: '确定清空所有预约吗？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: async () => {
        Api.get(`${item.url.replace(/.*\/api/g, '/api')}cancel_all/`);
        message.success('确定')
      },
      onNegativeClick: () => {}
    })
  }
  if (key === "edit") {
    router.push(`/schedule/${item.url.split("/").slice(-2)[0]}`);
  }
}
</script>