export const ackReportApi = {
  list: (queryString: string) => `/reports/ack/?${queryString}`,
  save: (queryString: string) => `/reports/ack/ack_report_csv/?${queryString}`,
}
export const logReportApi = {
  list: (queryString: string) => `/reports/logs/?${queryString}`,
  save: (queryString: string) => `/reports/logs/export_csv/?${queryString}`,
}
export const accessReportApi = {
  list: (queryString: string) => `/reports/access/?${queryString}`,
  save: (queryString: string) => `/reports/access/access_report_csv/?${queryString}`,
}
export const smartReportApi = {
  list: (queryString: string) => `/reports/smart_report_view/?${queryString}`,
  save: (queryString: string) => `/reports/smart_report_view/smart_report_csv/?${queryString}`,
}
export const systemReport = {
  dashboard: '/homes/informations/',
}
export const occupancyReportApi = {
  list: (queryString: string) => `/reports/occupancy_report/?${queryString}`,
  save: (queryString: string) => `/reports/occupancy_report/occu_report_csv/?${queryString}`,
}
export const guardReportApi = {
  list: (queryString: string) => `/reports/guard_report/?${queryString}`,
  save: (queryString: string) => `/reports/guard_report/guard_report_csv/?${queryString}`,
}
export const attendanceReportApi = {
  list: (queryString: string) => `/reports/attendance_report/?${queryString}`,
  save: (queryString: string) => `/reports/attendance_report/attendance_report_csv/?${queryString}`,
}
