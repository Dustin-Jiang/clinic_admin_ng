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
    status === RecordStatus.UNRESOLVE ||
    status === RecordStatus.APPOINTMENT_COMFIRMED
  ) return "warning"
  if (
    status === RecordStatus.RESOLVING
  ) return "default"
  if (
    status === RecordStatus.ANOTHER_DAY ||
    status === RecordStatus.GO_TO_OEM ||
    status === RecordStatus.WHERE_ARE_YOU
  ) return "info"
  if (
    status === RecordStatus.APPOINTMENT_REJECTED
  ) return "error"
  if (
    status === RecordStatus.RESOLVED
  ) return "success"

  else return status
}
</script>