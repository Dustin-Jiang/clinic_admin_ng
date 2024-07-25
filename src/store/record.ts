import { computed, ref } from "vue";
import type API from "./api";
import Api from "@/utils/Api";
import store from ".";

const nextRecordsPage = ref(1)

const load = async () => {
  const page = nextRecordsPage.value
  nextRecordsPage.value += 1
  const response = (await Api.get<API.IRecords>(`/api/records/?page=${page}`)).data
  response.results.forEach((record) => {
    store.records[record.id] = record
  })
}

const update = async (updated: API.Record) => {
  try {
    console.debug(updated)
    await Api.put(
      updated.url.replace(/.*\/api/g, '/api'),
      updated
    )

    store.records[updated.id] = updated

    console.debug(store.records)
  } catch (e) {
    console.error(e)
  }
}


const filter = (record: API.Record, filters: typeof store.filters) => {
  let result = true
  for (const key in filters) {
    const filterList = filters[key]
    result &&= filterList.reduce<boolean>((pre, f) => f.filter(record) && pre, true)
    console.debug('filter: ', filterList, result)
  }
  return result
}

const visibility = computed(
  () =>
    Object.keys(store.records)
      .map((key) => {
        return filter(store.records[parseInt(key)], store.filters) ? parseInt(key) : null
      })
      .filter((value) => value !== null) as number[]
)

const prevRecord = ((id: number) => {
  const index = visibility.value.indexOf(id)
  if (index - 1 < 0) {
    return null
  }
  return visibility.value[index - 1]
})

const nextRecord = ((id: number) => {
  const index = visibility.value.indexOf(id)
  if (index + 1 >= visibility.value.length) {
    return null
  }
  return visibility.value[index + 1]
})

const isPrevRecordExist = ((id: number) => {
  const index = visibility.value.indexOf(id)
  if (index - 1 < 0) {
    return false
  }
  return true
})

const isNextRecordExist = ((id: number) => {
  const index = visibility.value.indexOf(id)
  if (index + 1 >= visibility.value.length) {
    return false
  }
  return true
})

//@ts-ignore
window.$update = update

export {
  load,
  update,
  visibility,
  nextRecord,
  prevRecord,
  isPrevRecordExist,
  isNextRecordExist
}
