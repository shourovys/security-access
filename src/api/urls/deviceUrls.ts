export const nodeApi = {
  list: (queryString: string) => `/devices/nodes/?${queryString}`,
  tempList: (queryString: string) => `/devices/nodes/add/temp_list/?${queryString}`,
  add: '/devices/nodes/add/apply/',
  clearAll: '/devices/nodes/add/clear_all/',
  edit: (id: string) => `/devices/nodes/${id}/`,
  delete: (id: string) => `/devices/nodes/${id}/`,
  deleteMultiple: '/devices/nodes/',
  details: (id: string) => `/devices/nodes/${id}/`,
  check: '/devices/nodes/check/',
  export: '/devices/nodes/export/',
  setTime: '/devices/nodes/set_time/',
  swSync: '/devices/nodes/sw_sync/',
  dbSync: '/devices/nodes/db_sync/',
  reboot: '/devices/nodes/reboot/',
  reload: '/devices/nodes/reload/',
  mediaType: (queryString: string) => `/maintenances/update/?${queryString}`,
}

export const nodeScanApi = {
  list: `/devices/node_scan/scan_list/`,
  getNetwork: '/devices/node_scan/get_network/',
  setNetwork: '/devices/node_scan/set_network/',
  getLicense: '/devices/node_scan/get_license/',
  setLicense: '/devices/node_scan/set_license/',
  getLicenseKey: '/devices/node_scan/get_license_key/',
  getSystem: '/devices/node_scan/get_system/',
  setSystem: '/devices/node_scan/set_system/',
  getTime: '/devices/node_scan/get_time/',
  setTime: '/devices/node_scan/set_time/',
  setMaintenance: '/devices/node_scan/set_maintenance/',
}

export const doorApi = {
  list: (queryString: string) => `/devices/doors/?${queryString}`,
  add: '/devices/doors/',
  edit: (id: string) => `/devices/doors/${id}/`,
  groupEdit: '/devices/doors/group_update/',
  delete: (id: string) => `/devices/doors/${id}/`,
  deleteMultiple: '/devices/doors/',
  details: (id: string) => `/devices/doors/${id}/`,
  export: '/devices/doors/export/',
  doorStatus: '/devices/doors/door_status/',
  lockStatus: '/devices/doors/lock_status/',
  contact: '/devices/doors/contact/',
}

export const doorRuleApi = {
  list: (queryString: string) => `/devices/rules/?${queryString}`,
  add: '/devices/rules/',
  edit: (id: string) => `/devices/rules/${id}/`,
  delete: (id: string) => `/devices/rules/${id}/`,
  deleteMultiple: '/devices/rules/',
  details: (id: string) => `/devices/rules/${id}/`,
}

export const regionApi = {
  list: (queryString: string) => `/devices/regions/?${queryString}`,
  add: '/devices/regions/',
  edit: (id: string) => `/devices/regions/${id}/`,
  delete: (id: string) => `/devices/regions/${id}/`,
  deleteMultiple: '/devices/regions/',
  details: (id: string) => `/devices/regions/${id}/`,
  export: '/devices/regions/export/',
}

export const inputApi = {
  list: (queryString: string) => `/devices/inputs/?${queryString}`,
  add: '/devices/inputs/',
  edit: (id: string) => `/devices/inputs/${id}/`,
  groupEdit: '/devices/inputs/group_update/',
  delete: (id: string) => `/devices/inputs/${id}/`,
  deleteMultiple: '/devices/inputs/',
  details: (id: string) => `/devices/inputs/${id}/`,
  export: '/devices/inputs/export/',
  probe: '/devices/inputs/probe/',
}

export const outputApi = {
  list: (queryString: string) => `/devices/outputs/?${queryString}`,
  add: '/devices/outputs/',
  edit: (id: string) => `/devices/outputs/${id}/`,
  groupEdit: '/devices/outputs/group_update/',
  delete: (id: string) => `/devices/outputs/${id}/`,
  deleteMultiple: '/devices/outputs/',
  details: (id: string) => `/devices/outputs/${id}/`,
  export: '/devices/outputs/export/',
  action: '/devices/outputs/action/',
}

export const elevatorApi = {
  list: (queryString: string) => `/devices/elevators/?${queryString}`,
  add: '/devices/elevators/',
  edit: (id: string) => `/devices/elevators/${id}/`,
  groupEdit: '/devices/elevators/group_update/',
  delete: (id: string) => `/devices/elevators/${id}/`,
  deleteMultiple: '/devices/elevators/',
  details: (id: string) => `/devices/elevators/${id}/`,
  export: '/devices/elevators/export/',
  action: '/devices/elevators/action/',
}

export const relayApi = {
  list: (queryString: string) => `/devices/relays/?${queryString}`,
  add: '/devices/relays/',
  edit: (id: string) => `/devices/relays/${id}/`,
  groupEdit: '/devices/relays/group_update/',
  delete: (id: string) => `/devices/relays/${id}/`,
  deleteMultiple: '/devices/relays/',
  details: (id: string) => `/devices/relays/${id}/`,
  export: '/devices/relays/export/',
  action: '/devices/relays/action/',
}

export const triggerApi = {
  list: (queryString: string) => `/devices/triggers/?${queryString}`,
  add: '/devices/triggers/',
  edit: (id: string) => `/devices/triggers/${id}/`,
  delete: (id: string) => `/devices/triggers/${id}/`,
  deleteMultiple: '/devices/triggers/',
  details: (id: string) => `/devices/triggers/${id}/`,
  export: '/devices/triggers/export/',
  trigger: '/devices/triggers/trigger/',
}

export const threatApi = {
  list: (queryString: string) => `/devices/threats/?${queryString}`,
  add: '/devices/threats/',
  edit: (id: string) => `/devices/threats/${id}/`,
  delete: (id: string) => `/devices/threats/${id}/`,
  deleteMultiple: '/devices/threats/',
  details: (id: string) => `/devices/threats/${id}/`,
  export: '/devices/threats/export/',
  action: '/devices/threats/action/',
}
