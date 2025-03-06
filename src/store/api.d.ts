/* eslint-disable @typescript-eslint/no-unused-vars */
namespace API {
  type Url = string
  type DateString = `${number}-${number}-${number}`
  type TimeString = string
  type Password = string

  // /api/campus/
  type Campus = {
    name: string
    address: string
  }

  interface ICampus {
    [k: number]: Campus
  }

  // /api/date/
  type DateStatus = {
    url: Url
    count: number
    finish: number

    campus: Campus["name"]
    title: string
    date: DateString
    capacity: number
    startTime: TimeString
    endTime: TimeString
  }

  interface IDateStatus {
    campus: Campus["name"]
    title: string
    date: DateString
    capacity: number
    startTime: TimeString
    endTime: TimeString
  }

  // /api/users
  interface IUsers {
    url: Url
    id: number

    username: string
    realname: string

    school: string
    campus: Campus["name"]
    phone_num: string

    is_staff: boolean

    work_mon: boolean
    work_tue: boolean
    work_wedn: boolean
    work_thu: boolean
    work_fri: boolean
    work_sat: boolean
    work_sun: boolean
  }

  // /api/records
  type Record = {
    url: Url
    id: number
    status: RecordStatus

    realname: string
    phone_num: string
    campus: Campus["name"]

    description: string
    model: string
    password: Password

    appointment_time: DateString
    arrive_time: TimeString | null
    deal_time: unknown

    worker_description: string
    method: unknown
    reject_reason: string | null

    is_taken: boolean

    user: Url
    worker: Url
  }

  interface IRecords {
    count: number
    next: Url
    previous: Url
    results: Record[]
  }

  type RecordDesc = {
    label: string,
    value: string,
    children?: RecordDesc[]
  }

  interface IAnnouncement {
    url: Url

    title: string
    content: string
    brief: string

    priority: number
    tag: AnnouncementTags

    createdTime: string
    lastEditedTime: string
    expireDate: DateString
  }

  type AnnouncementTags = "TOS" | "TA" | "AN"
}

export default API