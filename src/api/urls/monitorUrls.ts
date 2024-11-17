export const homeApi = {
  logDetails: (id: string, Reference: string) => `/reports/logs/${id}/?Reference=${Reference}`,
  arkComment: '/homes/ack/',
  arkList: (queryString: string) => `/homes/ack/?${queryString}`,
  live: (queryString: string) => `/homes/live/?${queryString}`,
  playback: (queryString: string) => `/homes/playback/?${queryString}`,
  getPlaybackStream: '/homes/playback_request/',
}

export const floorDartboardApi = {
  floorDashboard: (floorNo: string) => `/homes/dashboard/floors/?FloorNo=${floorNo}`,
  floorLogs: '/homes/dashboard/floors/logs/',
  floorAckCount: '/homes/dashboard/floors/ack_count/',
  saveButtonPositions: '/homes/dashboard/floors/position/',
  imageUpload: '/homes/dashboard/floors/image/',
}

export const favoriteApi = {
  list: '/homes/favorites/',
  edit: '/homes/favorites/',
}

export const floorApi = {
  list: (queryString: string) => `/monitors/floors/?${queryString}`,
  add: '/monitors/floors/',
  edit: (id: string) => `/monitors/floors/${id}/`,
  delete: (id: string) => `/monitors/floors/${id}/`,
  deleteMultiple: '/monitors/floors/',
  details: (id: string) => `/monitors/floors/${id}/`,
  elements: (id: string) => `/monitors/floors/elemets/${id}/`,
  addElements: (id: string, elementType: string) =>
    `/monitors/floors/${id}/devices/?DeviceType=${elementType}/`,
}

export const viewApi = {
  list: (queryString: string) => `/monitors/views/?${queryString}`,
  add: '/monitors/views/',
  edit: (id: string) => `/monitors/views/${id}/`,
  delete: (id: string) => `/monitors/views/${id}/`,
  deleteMultiple: '/monitors/views/',
  details: (id: string) => `/monitors/views/${id}/`,
  export: '/monitors/views/export',
}
