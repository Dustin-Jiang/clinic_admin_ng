<template>
  <n-button size="small" secondary :type="color(props.status)">
    {{
      (typeof props.status === "number") ? RECORD_STATUS_DESC[props.status] : props.text!
    }}
  </n-button>
</template>

<script setup lang="ts">
import { RECORD_STATUS_DESC, RecordStatus } from '@/utils/constants';
const props = defineProps<{
  status: number | string,
  text?: string
}>()

const color = (status: number | string) => {
  if (
    status === RecordStatus.APPOINTMENT_PENDING ||
    status === RecordStatus.PROCESS_PENDING ||
    status === RecordStatus.UNRESOLVE
  ) return "warning"
  if (
    status === RecordStatus.RESOLVING
  ) return "default"
  if (
    status === RecordStatus.ANOTHER_DAY ||
    status === RecordStatus.GO_TO_OEM ||
    status === RecordStatus.WHERE_ARE_YOU
  ) return "tertiary"
  if (
    status === RecordStatus.APPOINTMENT_REJECTED
  ) return "error"
  if (
    status === RecordStatus.RESOLVED
  ) return "success"
  if (
    status === RecordStatus.APPOINTMENT_CONFIRMED
  ) return "info"

  else return status
}
</script>