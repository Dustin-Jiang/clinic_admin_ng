<template>
  <n-element style="padding: 12px 48px 48px; max-width: 1200px; margin: 0 auto;">
    <n-h1 type="primary" style="position: relative; left: -24px; margin: unset">
      <n-text type="primary" style="display: inline-block; width: 24px;">#</n-text>
      <n-text>{{ record?.id }}</n-text>
    </n-h1>
    <StatusBadge :status="record?.status" />
    <n-h2 prefix="bar" align-text>
      <n-text>问题描述</n-text>
    </n-h2>
    {{ record?.description }}
    <n-h2 prefix="bar" align-text>
      具体信息
    </n-h2>
    <n-grid cols="1 s:2 m:3 l:4 xl:5" responsive="screen" x-gap="8" y-gap="32">
      <n-grid-item>
        <n-thing>
          <template #header>机主</template>
          {{ `${record?.realname ?? "无名氏"} - ${owner?.username ?? ""}` }}
          <n-skeleton text width="100px" v-if="!owner?.username"/>
        </n-thing>
      </n-grid-item>
      <n-grid-item>
        <n-thing>
          <template #header>联系方式</template>
          {{ record?.phone_num ?? "无" }}
        </n-thing>
      </n-grid-item>
      <n-grid-item>
          <n-thing>
            <template #header>校区</template>
            {{ record?.campus }}
          </n-thing>
        </n-grid-item>
      <n-grid-item>
        <n-thing>
            <template #header>预约时间</template>
            {{ record?.appointment_time }}
          </n-thing>
      </n-grid-item>
      <n-grid-item>
        <n-thing>
            <template #header>设备型号</template>
            {{ record?.model ?? "未知" }}
          </n-thing>
      </n-grid-item>
      <n-grid-item>
        <n-thing>
            <template #header>设备密码</template>
            <n-element>{{ record?.password || "无" }}</n-element>
          </n-thing>
      </n-grid-item>
    </n-grid>

    <n-h2 prefix="bar" align-text>
      处理情况
    </n-h2>
    <n-grid cols="1 s:2 m:3 l:4 xl:5" responsive="screen" x-gap="8" y-gap="32"
      v-if="record?.status > RecordStatus.APPOINTMENT_PENDING && record?.status !== RecordStatus.WHERE_ARE_YOU"
    >
        <n-grid-item>
          <n-thing>
            <template #header>处理人员</template>
            <n-skeleton text width="100px" v-if="!worker?.realname"/>
            {{ worker?.realname ?? "" }}
          </n-thing>
        </n-grid-item>
        <n-grid-item v-if="record?.status >= RecordStatus.RESOLVED">
          <n-thing>
            <template #header>到达时间</template>
            {{ (new Date(record?.arrive_time!)).toLocaleString() }}
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
        <n-grid-item v-if="record?.status === RecordStatus.APPOINTMENT_REJECTED">
            <n-thing>
                <template #header>驳回理由</template>
                <n-element>{{ record?.reject_reason ?? "无" }}</n-element>
              </n-thing>
          </n-grid-item>
      </n-grid>
  </n-element>
</template>

<script setup lang="ts">
import type API from '@/store/api';
import records from '@/store/record';
import Api from '@/utils/Api';
import { RecordStatus } from '@/utils/constants';
import { useMessage } from 'naive-ui';
import { onMounted, onUpdated, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const message = useMessage()

const props = defineProps({
  recordId: {
    type: String,
    required: true
  }
})

const record = ref<API.Record | null>(null)
const owner = ref<API.IUsers | null>(null)
const worker = ref<API.IUsers | null>(null)
const loadRecord = async () => {
  record.value = records.find((record) => record.id.toString() === props.recordId)!

  console.debug(record.value)
  setTimeout(() => {
    if (!record.value) {
      message.error("加载不出来了啦 qwq")
      router.replace("/")
      return
    }
  }, 5000)

  if (record.value?.user) {
    owner.value = (await Api.get<API.IUsers>(
      record.value.user.replace(/.*\/api/g, "/api")
    )).data
  }
  if (record.value?.worker) {
    worker.value = (await Api.get<API.IUsers>(
      record.value.worker.replace(/.*\/api/g, "/api")
    )).data
  }
}

onMounted(loadRecord)
onUpdated(() => {
  owner.value = null
  worker.value = null
  loadRecord()
})
watch(() => records.length, loadRecord)
</script>