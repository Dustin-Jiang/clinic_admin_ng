<template>
  <PageWrapper title="编辑服务时间">
    <n-form :model="formValue" :rules="formRule" ref="formRef">
      <n-grid cols="18 800:22" :x-gap="22">
        <n-form-item-gi :span="8" label="服务描述" path="description">
          <n-input v-model:value="formValue!.description" placeholder="描述" />
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="选择校区" path="campus">
          <n-select v-model:value="formValue!.campus" :options="campuses" placeholder="校区" />
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="设置容量" path="capacity">
          <n-input-number v-model:value="formValue!.capacity" placeholder="容量" />
        </n-form-item-gi>
        <n-form-item-gi span="12 500:0"></n-form-item-gi>
        <n-form-item-gi :span="6" label="开始时间" path="startTime">
          <n-time-picker v-model:value="formValue!.startTime" placeholder="开始时间" style="width: 100%" />
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="结束时间" path="endTime">
          <n-time-picker v-model:value="formValue!.endTime" placeholder="结束时间" style="width: 100%" />
        </n-form-item-gi>
        <n-form-item-gi span="12 800:8" label="日期">
          <n-date-picker v-model:value="formValue!.date" placeholder="日期" style="width: 100%"
            :is-date-disabled="isDateDisabled" />
        </n-form-item-gi>
      </n-grid>
      <n-form-item>
        <n-button type="primary" @click="handleSubmit" style="width: 150px" :loading="loading">提交</n-button>
      </n-form-item>
    </n-form>
  </PageWrapper>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import store, { load } from "@/store";
import type { FormInst } from "naive-ui";
import type API from "@/store/api";
import Api from "@/utils/Api";
import { useMessage } from 'naive-ui';
import Auth from "@/utils/Auth";

const props = defineProps({
  dateId: {
    type: String,
    required: true
  }
})

const message = useMessage();
const loading = ref<boolean>(false)

const formRef = ref<FormInst | null>();

const toTime = (time: number) => {
  const date = new Date(time);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}` as API.TimeString;
}

const toDate = (time: number) => {
  const date = new Date(time);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` as API.DateString;
};

const datesUnavailable = computed(() => store.dateList.reduce((acc, date) => {
  const key = date.campus;
  if (!acc.has(key)) {
    acc.set(key, []);
  }
  acc.get(key)?.push(date.date);
  return acc;
}, new Map<string, API.DateString[]>()))

const isDateDisabled = (current: number) => {
  const key = toDate(current);
  return key !== toDate(originalValue.date!) &&
    datesUnavailable.value.has(formValue.value?.campus!) &&
    datesUnavailable.value.get(formValue.value?.campus!)?.includes(key);
}

const campuses = computed(() => store.campusList.map((item) => {
  return {
    label: item.name,
    value: item.name
  }
}));

let originalValue = {
  description: "",
  campus: "",
  capacity: 0,
  startTime: 0,
  endTime: 0,
  date: 0,
}
const formValue = ref(originalValue);

const formRule = {
  description: { required: true, message: "请输入服务描述", trigger: ["blur"] },
  campus:
    { required: true, message: "请选择校区", trigger: ["change"] },
  capacity:
  {
    required: true, message: "请输入容量", trigger: ["blur"], validator: (rule: any, value: number) => {
      if (value < 1) {
        return "哎呀不对不对不对";
      }
      return true;
    }
  },
  startTime:
  {
    required: true, message: "请选择开始时间", trigger: ["change"], validator: (rule: any, value: number) => {
      return value !== 0;
    }
  },
  endTime:
  {
    required: true, message: "请选择结束时间", trigger: ["change"], validator: (rule: any, value: number) => {
      return value !== 0;
    }
  }
}

const schedule = ref<API.DateStatus>();

onMounted(async () => {
  if (!store.campusList.length) {
    await load();
  }
  await Auth.auth();
  console.debug("campuses", campuses.value);
  console.debug("dates", store.dateList);
  console.debug("datesUnavailable", datesUnavailable.value);
  for (const date of store.dateList) {
    if (date.url.split("/").slice(-2)[0] === props.dateId) {
      schedule.value = date;
      formValue.value = {
        description: date.title,
        campus: date.campus,
        capacity: date.capacity,
        startTime: new Date(`1970-01-01T${date.startTime}`).getTime(),
        endTime: new Date(`1970-01-01T${date.endTime}`).getTime(),
        date: new Date(date.date).getTime(),
      };
      originalValue = { ...formValue.value };
      break;
    }
  }
})

const handleSubmit = () => {
  formRef.value?.validate().then(async (valid) => {
    if (valid) {
      if (!formValue.value) return;

      const status: API.DateStatus = {
        ...schedule.value!,
        date: toDate(formValue.value.date),
        campus: formValue.value.campus!,
        capacity: formValue.value.capacity,
        startTime: toTime(formValue.value.startTime),
        endTime: toTime(formValue.value.endTime),
        title: formValue.value.description,
      }

      if (!formValue.value.date) return message.error("日期不对喔");

      try {
        await Api.put<API.DateStatus>(`/api/date/${props.dateId}/`, status);
        message.success("提交成功啦");
        // router.back();
      }
      catch (e) {
        message.error("提交失败");
      }
      finally {
        loading.value = false;
      }
    }
  })
}
</script>