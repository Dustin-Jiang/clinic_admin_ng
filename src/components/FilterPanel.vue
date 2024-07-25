<template>
  <n-h5>筛选</n-h5>
  <n-form-item label="校区">
    <n-select v-model:value="campus" :options="campusList" />
  </n-form-item>
  <n-form-item label="时间">
    <n-checkbox-group v-model:value="date" style="width: 100%">
      <n-checkbox value="all" label="全部" />
      <n-checkbox value="today" label="今天" />
      <n-checkbox value="past" label="之前" />
      <n-checkbox value="future" label="以后" />
    </n-checkbox-group>
  </n-form-item>
  <n-space style="padding: 8px 0">
    <n-button type="primary" @click="() => {
      store.filters = generateFilters()
      emit('close')
    }">确认</n-button>
    <n-button @click="() => {
      store.filters = {}
      emit('close')
    }">重置</n-button>
  </n-space>
</template>

<script setup lang="ts">
import store from "@/store";
import type API from "@/store/api";
import { onMounted, ref } from "vue"

const emit = defineEmits(["close"])

const campus = ref<API.Campus["name"]>("all")
const campusList = ref<{
  label: string,
  value: string
}[]>([{
  label: "全部",
  value: "all"
}])

type FilterDates = "all" | "today" | "past" | "future"
const date = ref<FilterDates[]>(["all"])

onMounted(() => {
  campus.value = store.filters["campus"] ? store.filters["campus"][0].value : "all"
  date.value = store.filters["date"] ? store.filters["date"].map((filter) => filter.value) as FilterDates[] : ["all"]

  console.debug("filterPanel: ", campus.value)

  store.campusList.forEach((campus) => campusList.value.push({
    label: campus.name,
    value: campus.name
  }))
})

const generateFilters = () => {
  let filters = {} as typeof store.filters

  if (!filters["campus"]) filters["campus"] = []
  if (campus.value !== "all") {
    filters["campus"].push({
      value: campus.value,
      filter: (ele) => ele.campus === campus.value
    })
  }
  else {
    filters["campus"].push({
      value: campus.value,
      filter: () => true
    })
  }

  date.value.forEach((date) => {
    if (!filters["date"]) filters["date"] = []
    let now = (new Date()).toISOString().slice(0, 10)
    let filter = ref<(args: any) => boolean>();
    switch (date) {
      case "today":
        filter.value = (ele) => ele.appointment_time === now;
        break;
      case "future":
        filter.value = (ele) => ele.appointment_time > now;
        break;
      case "past":
        filter.value = (ele) => ele.appointment_time < now;
        break;
      case "all":
        filter.value = (ele) => true
    }
    filters["date"].push({
      value: date,
      filter: filter.value
    })
  })
  return filters
}
</script>