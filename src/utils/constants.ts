export const RECORD_STATUS_DESC = [
  '上单问题未解决',
  '预约待确认',
  '预约已确认',
  '预约已驳回',
  '登记待受理',
  '正在处理',
  '已解决问题',
  '建议返厂',
  '交给明天解决',
  '未到诊所'
]

export const enum RecordStatus {
  'UNRESOLVE', // { value: 0, text: "上单问题未解决" },
  'APPOINTMENT_PENDING', // { value: 1, text: "预约待确认" },
  'APPOINTMENT_COMFIRMED', // { value: 2, text: "预约已确认" },
  'APPOINTMENT_REJECTED', // { value: 3, text: "预约已驳回" },
  'PROCESS_PENDING', // { value: 4, text: "登记待受理" },
  'RESOLVING', // { value: 5, text: "正在处理" },
  'RESOLVED', // { value: 6, text: "已解决问题" },
  'GO_TO_OEM', // { value: 7, text: "建议返厂" },
  'ANOTHER_DAY', // { value: 8, text: "交给明天解决" },
  'WHERE_ARE_YOU' // { value: 9, text: "未到诊所" }
}