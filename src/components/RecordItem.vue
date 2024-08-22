<template>
  <n-thing>
    <template #avatar>
      <n-avatar style="height: 48px; width: 48px;" >
        <n-icon >
          <StatusAvatar />
        </n-icon>
      </n-avatar>
    </template>
    <template #header> {{ props.data?.realname ?? "无名氏"}}</template>
    <template #header-extra> <n-text depth="3">{{ `#${props.data?.id}` }} </n-text> </template>
    <template #description> {{ props.data?.appointment_time }}</template>
    {{ props.data?.model }}
    <template #action>
      <n-space>
        <StatusBadge :status="props.data?.status!" />
        <StatusBadge status="default" :text="props.data?.campus" @click.stop="filterCampus"/>
      </n-space>
    </template>
  </n-thing>
</template>

<script setup lang="tsx">
import type API from '@/store/api';
import type { PropType } from 'vue';
import StatusBadge from "@/components/StatusBadge.vue"
import { RecordStatus } from '@/utils/constants';
import store from '@/store';

import AccessTimeFilledFilled from "@vicons/material/AccessTimeFilledFilled"
import AccessTimeOutline from "@vicons/material/AccessTimeOutlined"
import CancelFilled from "@vicons/material/CancelFilled"
import FactoryFilled from '@vicons/material/FactoryFilled';
import DoneFilled from '@vicons/material/DoneFilled';
import CalendarMonthFilled from '@vicons/material/CalendarMonthFilled';
import PersonOffFilled from '@vicons/material/PersonOffFilled';
import HandymanFilled from '@vicons/material/HandymanFilled';

const props = defineProps({
  data: Object as PropType<API.Record>
})

const StatusAvatar = () => {
  const status = props.data?.status
  if (
    status === RecordStatus.UNRESOLVE || 
    status === RecordStatus.APPOINTMENT_PENDING ||
    status === RecordStatus.PROCESS_PENDING
  ) return <AccessTimeOutline />

  if (
    status === RecordStatus.APPOINTMENT_CONFIRMED
  ) return <AccessTimeFilledFilled />

  if (
    status === RecordStatus.APPOINTMENT_REJECTED
  ) return <CancelFilled />

  if (
    status === RecordStatus.GO_TO_OEM
  ) return <FactoryFilled />

  if (
    status === RecordStatus.RESOLVED
  ) return <DoneFilled />

  if (
    status === RecordStatus.ANOTHER_DAY
  ) return <CalendarMonthFilled />

  if (
    status === RecordStatus.WHERE_ARE_YOU
  ) return <PersonOffFilled />

  if (
    status === RecordStatus.RESOLVING
  ) return <HandymanFilled />
}

const filterCampus = () => {
  const filters = store.filters

  filters['campus'] = [{
    value: props.data?.campus!,
    filter: (ele) => ele.campus === props.data?.campus
  }]
  // eslint-disable-next-line no-self-assign
  store.filters = filters
}
</script>