export const updateApi = {
  fileOption: (queryString: string) => `/maintenances/update/?${queryString}`,
  edit: '/maintenances/update/',
  updateServer: '/maintenances/update_server/',
}

export const backupApi = {
  edit: '/maintenances/backups/',
  fileOption: (queryString: string) => `/maintenances/backups/?${queryString}`,
}

export const backupScheduleApi = {
  list: (queryString: string) => `/maintenances/backup_schedules/?${queryString}`,
  add: '/maintenances/backup_schedules/',
  edit: (id: string) => `/maintenances/backup_schedules/${id}/`,
  delete: (id: string) => `/maintenances/backup_schedules/${id}/`,
  deleteMultiple: '/maintenances/backup_schedules/',
  details: (id: string) => `/maintenances/backup_schedules/${id}/`,
}

export const restoreApi = {
  edit: '/maintenances/restore/',
}

export const archiveApi = {
  edit: '/maintenances/archive/',
}

export const archiveScheduleApi = {
  list: (queryString: string) => `/maintenances/archive_schedules/?${queryString}`,
  add: '/maintenances/archive_schedules/',
  edit: (id: string) => `/maintenances/archive_schedules/${id}/`,
  delete: (id: string) => `/maintenances/archive_schedules/${id}/`,
  deleteMultiple: '/maintenances/archive_schedules/',
  details: (id: string) => `/maintenances/archive_schedules/${id}/`,
}

export const getBackApi = {
  fileOption: (queryString: string) => `/maintenances/getback/?${queryString}`,
  edit: '/maintenances/getback/',
}

export const maintenanceActionApi = {
  add: `/maintenances/maintenance/`,
}

export const miscellaneousApi = {
  details: '/maintenances/miscellaneous/',
  edit: '/maintenances/miscellaneous/',
}
