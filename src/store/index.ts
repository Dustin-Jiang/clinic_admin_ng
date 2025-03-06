import { reactive } from 'vue'
import type API from './api';
import Api from "@/utils/Api";
import { load as loadRecords } from './record'
import { probDescs, repairMethods } from '@/utils/constants';

const store = reactive({
  isDrawerOpen: false,
  drawerScroll: 0,
  records: {} as {
    [k: API.Record['id']]: API.Record
  },
  filters: {} as {
    [key: string]: {
      value: string
      filter: (record: API.Record) => boolean
    }[]
  },
  campusList: [] as API.Campus[],
  dateList: [] as API.DateStatus[],
  repairMethods: [] as API.RecordDesc[],
  probDescs: [] as API.RecordDesc[],
  history: new Map<API.Record['id'], API.Record[]>(),
  announcementList: [] as API.IAnnouncement[],
})

const load = async () => {
  await loadRecords()

  const campus = (await Api.get<API.Campus[]>('/api/campus/')).data
  store.campusList = campus

  const dates = (await Api.get<API.DateStatus[]>('/api/date/')).data
  store.dateList = dates

  const annoucements = (await Api.get<API.IAnnouncement[]>('/api/announcement/')).data
  store.announcementList = annoucements

  console.debug("storeLoad: ", repairMethods)
  store.repairMethods = repairMethods

  store.probDescs = probDescs
}

//@ts-ignore
window.$store = store

export default store;
export { load }