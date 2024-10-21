<template>
  <n-element style="padding: 12px 48px 48px; max-width: 1600px; margin: 0 auto;">
    <n-h1 prefix="bar" align-text style="margin-top: 0.5rem">
      服务时间管理
    </n-h1>

    <div v-if="Object.keys(dateGroup.groups).length > 0">
      <n-tabs v-for="(list, idx) in dateGroup" :key="idx" animated>
        <n-tab-pane v-for="(items, date) in list" :name="date" :tab="date" :key="date">
          <n-grid cols="1 400:2" :x-gap="8" :y-gap="8">
            <n-grid-item v-for="item in items" :key="item.url">
              <n-card>
                <n-thing :title="item.campus" :title-extra="item.title"
                  :description="`${item.startTime} - ${item.endTime}`">
                  {{ `已预约 ${item.count} / ${item.capacity}` }}
                </n-thing>
                <template #suffix>
                  <n-button type="primary" size="small" @click="() => { }">
                    编辑
                  </n-button>
                  <n-button type="danger" size="small" @click="() => { }">
                    删除
                  </n-button>
                </template>
              </n-card>
            </n-grid-item>
          </n-grid>
        </n-tab-pane>
      </n-tabs>
    </div>
    <n-empty v-else />
  </n-element>

  <n-float-button :right="16" :bottom="24" type="primary" :width="144" :height="56">
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
import { onMounted, reactive } from 'vue';
import PlaylistAddFilled from '@vicons/material/PlaylistAddFilled';

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
</script>