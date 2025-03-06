<template>
  <n-space vertical>
    <!-- 预约未确认 -->
    <n-space vertical v-if="record?.status === RecordStatus.APPOINTMENT_PENDING">
      <n-radio-group v-model:value="confirmation">
        <n-space>
          <n-radio key="resolve" :value="RecordStatus.APPOINTMENT_CONFIRMED">确认受理</n-radio>
          <n-radio key="reject" :value="RecordStatus.APPOINTMENT_REJECTED">驳回预约</n-radio>
          <n-radio key="oem" :value="RecordStatus.GO_TO_OEM">建议返厂</n-radio>
        </n-space>
      </n-radio-group>

      <n-collapse-transition :show="isConfirmed">
        <div style="margin: 0.5em 0;">调整场地</div>
        <n-select :options="campusList" v-model:value="campusSelect" />
      </n-collapse-transition>

      <n-collapse-transition :show="!isConfirmed">
        <n-input type="textarea" placeholder="拒绝的理由是?" v-model:value="rejectReason" />
      </n-collapse-transition>

      <n-button :type="isConfirmed ? 'success' : 'error'" style="width: 150px"
        @click="handleAppointmentSubmit(isConfirmed, record!)">
        提交
      </n-button>
    </n-space>

    <!-- 预约确认, 未到诊所 -->
    <n-space v-if="
      record?.status === RecordStatus.APPOINTMENT_CONFIRMED
    ">
      <n-button type="primary" style="width: 150px" :disabled="loading !== null" :loading="loading === 'arrive'"
        @click="handleAppointmentArrive(record!)">
        <template #icon>
          <DoneFilled />
        </template>
        已到诊所
      </n-button>
      <n-button style="width: 150px" :disabled=" loading !== null " :loading="loading === 'whereRU'"
        @click="handleAppointmentMissing(record!)">
        <template #icon>
          <PersonOffFilled />
        </template>
        未到诊所
      </n-button>
      <ChangeCampus :record="record" :loading="loading" :campusList="campusList"
        :handleCommit="handleAppointmentChangeCampus" />
    </n-space>

    <!-- 正在处理 -->
    <n-space vertical v-if="
      record?.status === RecordStatus.RESOLVING
    ">
      <RepairComment v-model:value="probDescs" label="问题描述" :options="store.probDescs" />
      <RepairComment v-model:value="repairComment" label="处理方式" :options="store.repairMethods" />
      <n-space>
        <n-button type="primary" style="width: 150px" :disabled="loading !== null || !repairComment.validate"
          :loading="loading === 'resolve'" @click="() => handleAppointmentComplete(record!)">
          <template #icon>
            <DoneFilled />
          </template>
          已解决
        </n-button>
        
        <n-button style="width: 150px" :disabled="loading !== null" :loading="loading === 'goToOEM'"
          @click="() => handleAppointmentGoToOEM(record!)">
          <template #icon>
            <FactoryFilled />
          </template>
          建议返厂
        </n-button>
        
        <ChangeCampus :record="record" :loading="loading" :campusList="campusList"
          :handleCommit="handleAppointmentChangeCampus" />
      </n-space>
    </n-space>

    <n-space>
      <n-collapse-transition :show="store.history.get(record?.id!)?.length ?? 0 !== 0">
        <n-button style="width: 150px" @click="() => revertRecord(record?.id!)">
          <template #icon>
            <HistoryFilled />
          </template>
          后悔药
        </n-button>
      </n-collapse-transition>
    </n-space>
  </n-space>
</template>

<script setup lang="tsx">
import store from '@/store';
import type API from '@/store/api';
import { update } from '@/store/record';
import Auth from '@/utils/Auth';
import { RecordStatus } from '@/utils/constants';
import DoneFilled from "@vicons/material/DoneFilled";
import PersonOffFilled from "@vicons/material/PersonOffFilled";
import HistoryFilled from "@vicons/material/HistoryFilled";
import FactoryFilled from "@vicons/material/FactoryFilled";
import { useMessage } from 'naive-ui';
import { computed, onUpdated, ref, toRaw } from 'vue';

const props = defineProps<{
  record: API.Record | null,
  worker: API.IUsers | null
}>()

const message = useMessage()

const confirmation = ref<RecordStatus>(RecordStatus.APPOINTMENT_CONFIRMED)
const isConfirmed = computed(() => confirmation.value === RecordStatus.APPOINTMENT_CONFIRMED)
const rejectReason = ref("")
const loading = ref<null | "arrive" | "whereRU" | "changeCampus" | "resolve" | "goToOEM">(null)
const repairComment = ref({
  validate: false,
  value: "",
  display: ""
})
const probDescs = ref({
  validate: false,
  value: "",
  display: ""
})

const campusList = computed(() => store.campusList.map((campus) => ({
  label: campus.name,
  value: campus.name
})))
const campusSelect = ref<string | null>(props.record?.campus ?? null)

onUpdated(() => {
  // reset refs
  confirmation.value = RecordStatus.APPOINTMENT_CONFIRMED
  rejectReason.value = ""
  console.debug("updated: ", props.record)
  campusSelect.value = props.record?.campus ?? null
  console.debug("campusList: ", campusList)
})

const handleAppointmentSubmit = (isConfirmed: boolean, record: API.Record) => {
  if (!isConfirmed)
  {
    if (!rejectReason.value)
    {
      message.error('请填写拒绝理由')
      return
    }
  }
  else {
    if (campusSelect.value !== record.campus)
    {
      record.campus = campusSelect.value!
    }
  }
  handleAppointmentConfirm(record)
}

const handleAppointmentArrive = (record: API.Record) => {
  loading.value = 'arrive'
  let updated = toRaw(record!)
  updated = {
    ...updated!,
    status: RecordStatus.RESOLVING,
    worker: Auth.user.value!.url,
    arrive_time: (new Date()).toISOString()
  }
  updateRecord(updated, record)
}

const handleAppointmentMissing = (record: API.Record) => {
  loading.value = 'whereRU'
  let updated = toRaw(record!)
  updated = {
    ...updated!,
    status: RecordStatus.WHERE_ARE_YOU,
    worker: Auth.user.value!.url
  }
  updateRecord(updated, record)
}

const handleAppointmentGoToOEM = (record: API.Record) => {
  loading.value = 'goToOEM'
  let updated = toRaw(record!)
  updated = {
    ...updated!,
    status: RecordStatus.GO_TO_OEM,
    worker: Auth.user.value!.url
  }
  updateRecord(updated, record)
}

const handleAppointmentConfirm = (record: API.Record) => {
  let updated = toRaw(record!)
  const status = confirmation.value
  const finished = (
    confirmation.value == RecordStatus.GO_TO_OEM || 
    confirmation.value == RecordStatus.APPOINTMENT_REJECTED
  )
  updated = {
    ...updated!,
    status,
    worker: Auth.user.value!.url,
    reject_reason: finished ? rejectReason.value : null,
    arrive_time: finished ? (new Date()).toISOString() : null
  }
  updateRecord(updated, record)
}

const handleAppointmentChangeCampus = (campus: API.Campus["name"], record: API.Record) => {
  loading.value = 'changeCampus'
  let updated = toRaw(record!)
  updated = {
    ...updated!,
    campus,
    worker: Auth.user.value!.url
  }
  updateRecord(updated, record)
}

const handleAppointmentComplete = (record: API.Record) => {
  console.debug('solve: ', repairComment.value.validate && probDescs.value.validate)
  console.debug('solve:', repairComment.value.value, ", ", repairComment.value.display)
  console.debug('solve:', probDescs.value.value, ", ", probDescs.value.display)
  loading.value = 'resolve'
  let updated = toRaw(record!)
  updated = {
    ...updated!,
    worker: Auth.user.value!.url,
    status: RecordStatus.RESOLVED,
    worker_description: probDescs.value.display,
    method: repairComment.value.display,
    deal_time: (new Date()).toISOString()
  }
  updateRecord(updated, record)
}

const updateRecord = async (updated: API.Record, prev: API.Record) => {
  store.history.set(prev.id, [
    ...(store.history.get(prev.id) ?? []),
    prev
  ])
  update(updated).then(() => {
    message.success('提交成功咯!')
  }).catch(() => {
    message.error('提交出错了qwq')
  }).finally(() => {
    loading.value = null
  })
}

const revertRecord = (id: number) => {
  const history = store.history.get(id)
  if (!history || history.length === 0)
  {
    message.error('时间不能倒流')
    return
  }
  const last = history.pop()!
  update(last).then(() => {
    message.success('Back to Future')
    store.records[id] = last
  }).catch(() => {
    message.error('时间机器坏了qwq')
  })
}
</script>