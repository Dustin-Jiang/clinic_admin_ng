<template>
  <n-grid cols="1 xs:2 s:2 m:3 l:3 xl:4" responsive="screen" x-gap="8" y-gap="32"
    v-if="record?.status > RecordStatus.APPOINTMENT_PENDING && record?.status !== RecordStatus.WHERE_ARE_YOU"
    style="margin-bottom: 16px">
    <n-grid-item>
      <n-thing>
        <template #header>处理人员</template>
        <n-skeleton text width="100px" v-if="!props.worker?.realname" />
        {{ worker?.realname ?? "" }}
      </n-thing>
    </n-grid-item>
    <n-grid-item v-if="record?.status >= RecordStatus.RESOLVING">
      <n-thing>
        <template #header>到达时间</template>
        {{ (new Date(record?.arrive_time ?? "")).toLocaleString() }}
      </n-thing>
    </n-grid-item>
    <n-grid-item v-if="record?.status >= RecordStatus.RESOLVED">
      <n-thing>
        <template #header>是否取走</template>
        {{ record?.is_taken ? "已取走" : "未取走" }}
      </n-thing>
    </n-grid-item>
    <n-grid-item v-if="record?.status >= RecordStatus.RESOLVED">
      <n-thing>

        <template #header>问题判断</template>
        {{ record?.worker_description ?? "无" }}
      </n-thing>
    </n-grid-item>
    <n-grid-item v-if="record?.status >= RecordStatus.RESOLVED">
      <n-thing>

        <template #header>解决方法</template>
        <n-element>{{ record?.method ?? "无" }}</n-element>
      </n-thing>
    </n-grid-item>
    <n-grid-item v-if="(
      record?.status === RecordStatus.APPOINTMENT_REJECTED ||
      record?.status === RecordStatus.GO_TO_OEM
    )">
      <n-thing>
        <template #header>驳回理由</template>
        <n-element>{{ record?.reject_reason ?? "无" }}</n-element>
      </n-thing>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import type API from "@/store/api"
import { RecordStatus } from '@/utils/constants';

const props = defineProps<{
  record: API.Record | null,
  worker: API.IUsers | null
}>()
</script>