<template>
  <n-form :rules="rules" :model="model" ref="formRef">
    <n-form-item :label="label" path="selection">
      <n-cascader multiple clearable filterable check-strategy="child" expand-trigger="hover" :show-path="true"
        :options="options" placeholder="可多选, 输入以筛选" v-model:value="model.selection"
        :filter="(pattern: string, option: CascaderOption, path: CascaderOption[]) => 
          optionFilter(pattern, option, path)" />
    </n-form-item>
    <n-collapse-transition :show="isOtherSelected">
      <n-form-item :label="'其他' + label" path="detail">
        <n-input type="textarea" placeholder="细说" v-model:value="model.detail" />
      </n-form-item>
    </n-collapse-transition>
  </n-form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import type { FormItemRule, NForm } from "naive-ui"

const result = defineModel<IRepairComment>("value")

const props = defineProps<{
  label: string,
  options: { label: string, value: string }[]
}>()

const model = ref<{
  selection: string[],
  detail: string
}>({
  selection: [],
  detail: ""
})

const formRef = ref<typeof NForm | null>(null)

watch(() => model.value.selection, () => {
  console.debug("selection: ", model.value.selection)
  console.debug("selection: ", model.value.selection.includes("other"))
  console.debug("selection: ", isOtherSelected.value)
})

const isOtherSelected = computed(() => {
  return model.value.selection.includes("other")
})

const comment = computed(() => model.value.selection.map((v) => {
  if (v == "other") return model.value.detail
  else return v;
}))

const validate = computed(() => {
  if (model.value.selection.includes("other")) {
    return model.value.detail.length > 0
  }
  return model.value.selection.length > 0
})

watch(comment, () => {
  result.value!.value = comment.value.join(", ")
  result.value!.validate = validate.value
  console.debug("comment: ", result.value)
})

const rules = {
  selection: {
    required: true,
    message: "请选择" + props.label,
    validator: (rule: FormItemRule, value: string) => {
      return value.length > 0
    },
    trigger: "blur"
  },
  detail: {
    required: true,
    message: "细细说说",
    trigger: "blur",
    key: "detail"
  },
}

interface IRepairComment {
  validate: boolean,
  value: string
}

type CascaderOption = {
  label: string,
  value: string,
  children?: CascaderOption[]
}

const optionFilter = (pattern: string, option: CascaderOption, path: CascaderOption[]) => {
  return option.label.toLowerCase().includes(pattern.toLowerCase())
}
</script>