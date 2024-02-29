<template>
  <div ref="listDOM" style="margin-top: 64px; overflow: auto; height: calc(100vh - 64px)" @scroll="handleScroll">
    <n-list hoverable clickable v-if="records.length > 0">
      <div v-if="Auth.user.value?.is_staff" style="padding: 12px 20px">
        <n-button type="primary" style="width: 100%;" size="large" @click="createRecord">
          添加任务
        </n-button>
      </div>
      <n-list-item v-for="record in records" :key="record.id" @click="() => showRecord(record)">
        <RecordItem :data="record"/>
      </n-list-item>
      <div style="padding: 12px 20px;">
        <n-button block :loading="loading" disabled>
          正在加载
        </n-button>
      </div>
    </n-list>
    <n-element v-else style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: center;">
      <n-text depth="3">暂时没有任务</n-text>
    </n-element>
  </div>
</template>

<script setup lang="ts">
import Api from "@/utils/Api";
import Auth from "@/utils/Auth";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router"
import type API from "@/store/api";
import records from "@/store/record"

import RecordItem from "@/components/RecordItem.vue"

const router = useRouter()

const nextRecordsUrl = ref("/api/records")

const listDOM = ref<HTMLDivElement | null>(null)
const handleScroll = () => {
  let { scrollHeight, scrollTop, clientHeight } = listDOM.value!
  if (scrollHeight - scrollTop - clientHeight <= 100) {
    loadRecords()
  }
}

onMounted(async () => {
  if (records.length === 0) loadRecords()
})

const loading = ref(false)
const loadRecords = async () => {
  if (loading.value) return
  loading.value = true

  const response = (await Api.get<API.IRecords>(nextRecordsUrl.value)).data
  response.results.forEach((record) => {
    records.push(record)
  });

  nextRecordsUrl.value = response.next.replace(/.*\/api/g, "/api")

  loading.value = false
}

const createRecord = () => {
  router.push("/createRecord")
}

const showRecord = (record: API.Record) => {
  const url = record.url.replace(/.*\/api/g, "").replace(/\/$/g, "")
  router.push(url)
}
</script>