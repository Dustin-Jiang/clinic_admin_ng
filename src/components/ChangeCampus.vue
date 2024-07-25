<template>
  <n-popconfirm :show-icon="false" :negative-text="null" positive-text="确定"
    @positive-click="handleCommit(campusSelect ?? record!.campus, record!)">
    <template #trigger>
      <n-button style="width: 150px" :disabled="loading !== null" :loading="loading === 'changeCampus'">
        <template #icon>
          <RefreshFilled />
        </template>
        调整场地
      </n-button>
    </template>

    <template #default>
      <div>
        <n-h5>调整场地</n-h5>
        <n-form-item label="发配至">
          <n-select :options="campusList" v-model:value="campusSelect" style="min-width: 16em" />
        </n-form-item>
      </div>
    </template>
  </n-popconfirm>
</template>

<script setup lang="ts">
import type API from '@/store/api';
import RefreshFilled from "@vicons/material/RefreshFilled"
import { onMounted } from "vue";

const props = defineProps<{
  record: API.Record;
  loading: string | null;
  campusList: { label: string; value: string }[];
  handleCommit: (campus: string, record: API.Record) => void;
}>();

const campusSelect = defineModel<string | null>("campusSelect")

onMounted(() => {
  campusSelect.value = props.record.campus
})
</script>