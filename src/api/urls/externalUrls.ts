export const cameraApi = {
  list: (queryString: string) => `/devices/cameras/?${queryString}`,
  add: '/devices/cameras/',
  edit: (id: string) => `/devices/cameras/${id}/`,
  delete: (id: string) => `/devices/cameras/${id}/`,
  deleteMultiple: '/devices/cameras/',
  details: (id: string) => `/devices/cameras/${id}/`,
  export: '/devices/cameras/export/',
  getStream: (cameraNo: string) => `/devices/cameras/${cameraNo}/req_stream/`,
  action: '/devices/cameras/action/',
}

export const nvrApi = {
  list: (queryString: string) => `/devices/nvrs/?${queryString}`,
  add: '/devices/nvrs/',
  edit: (id: string) => `/devices/nvrs/${id}/`,
  delete: (id: string) => `/devices/nvrs/${id}/`,
  deleteMultiple: '/devices/nvrs/',
  details: (id: string) => `/devices/nvrs/${id}/`,
  export: '/devices/nvrs/export/',
}

export const channelApi = {
  list: (queryString: string) => `/devices/channels/?${queryString}`,
  add: '/devices/channels/',
  edit: (id: string) => `/devices/channels/${id}/`,
  delete: (id: string) => `/devices/channels/${id}/`,
  deleteMultiple: '/devices/channels/',
  details: (id: string) => `/devices/channels/${id}/`,
  export: '/devices/channels/export/',
  controlStreaming: '/devices/streaming_control/',
  getStream: (channelNo: string) => `/devices/channels/${channelNo}/req_stream/`,
}

export const gatewayApi = {
  list: (queryString: string) => `/devices/gateways/?${queryString}`,
  add: '/devices/gateways/',
  edit: (id: string) => `/devices/gateways/${id}/`,
  delete: (id: string) => `/devices/gateways/${id}/`,
  deleteMultiple: '/devices/gateways/',
  details: (id: string) => `/devices/gateways/${id}/`,
  export: '/devices/gateways/export/',
  getNewCredential: (IpAddress: string, ApiPort: string) =>
    `/devices/gateways/new_credientials/?IpAddress=${IpAddress}&ApiPort=${ApiPort}`,
  serNewCredential: '/devices/gateways/new_credientials/',
  getFwUpdate: (IpAddress: string, ApiPort: string) =>
    `/devices/gateways/frameware_update/?IpAddress=${IpAddress}&ApiPort=${ApiPort}`,
  serFwUpdate: '/devices/gateways/frameware_update/',
}

export const locksetApi = {
  list: (queryString: string) => `/devices/locksets/?${queryString}`,
  add: '/devices/locksets/',
  edit: (id: string) => `/devices/locksets/${id}/`,
  delete: (id: string) => `/devices/locksets/${id}/`,
  deleteMultiple: '/devices/locksets/',
  details: (id: string) => `/devices/locksets/${id}/`,
  export: '/devices/locksets/export/',
  action: '/devices/locksets/action/',
  discover: (queryString: string) => `/devices/locksets/discover/?${queryString}`,
  fwUpdate: (id: string) => `/devices/locksets/${id}/fw_update/`,
}

export const facegateApi = {
  list: (queryString: string) => `/devices/facegates/?${queryString}`,
  add: '/devices/facegates/',
  edit: (id: string) => `/devices/facegates/${id}/`,
  delete: (id: string) => `/devices/facegates/${id}/`,
  deleteMultiple: '/devices/facegates/',
  details: (id: string) => `/devices/facegates/${id}/`,
  action: '/devices/facegates/action/',
}

export const serialApi = {
  list: (queryString: string) => `/devices/serial/?${queryString}`,
  add: '/devices/serial/',
  edit: (id: string) => `/devices/serial/${id}/`,
  delete: (id: string) => `/devices/serial/${id}/`,
  deleteMultiple: '/devices/serial/',
  details: (id: string) => `/devices/serial/${id}/`,
}

export const subnodeApi = {
  list: (queryString: string) => `/devices/subnodes/?${queryString}`,
  add: '/devices/subnodes/',
  edit: (id: string) => `/devices/subnodes/${id}/`,
  delete: (id: string) => `/devices/subnodes/${id}/`,
  deleteMultiple: '/devices/subnodes/',
  details: (id: string) => `/devices/subnodes/${id}/`,
  export: '/devices/subnodes/export/',
}

export const readerApi = {
  list: (queryString: string) => `/devices/readers/?${queryString}`,
  add: '/devices/readers/',
  edit: (id: string) => `/devices/readers/${id}/`,
  delete: (id: string) => `/devices/readers/${id}/`,
  deleteMultiple: '/devices/readers/',
  details: (id: string) => `/devices/readers/${id}/`,
  export: '/devices/readers/export/',
}

export const contGateApi = {
  list: (queryString: string) => `/devices/contgates/?${queryString}`,
  add: '/devices/contgates/',
  edit: (id: string) => `/devices/contgates/${id}/`,
  delete: (id: string) => `/devices/contgates/${id}/`,
  deleteMultiple: '/devices/contgates/',
  details: (id: string) => `/devices/contgates/${id}/`,
  export: '/devices/contgates/export/',
  discover: `/devices/contgates/discover/`,
}

export const contLockApi = {
  list: (queryString: string) => `/devices/contlocks/?${queryString}`,
  add: '/devices/contlocks/',
  edit: (id: string) => `/devices/contlocks/${id}/`,
  delete: (id: string) => `/devices/contlocks/${id}/`,
  deleteMultiple: '/devices/contlocks/',
  details: (id: string) => `/devices/contlocks/${id}/`,
  export: '/devices/contlocks/export/',
  action: '/devices/contlocks/action/',
  discover: (queryString: string) => `/devices/contlocks/discover/?${queryString}`,
}

export const intercomApi = {
  list: (queryString: string) => `/devices/intercoms/?${queryString}`,
  add: '/devices/intercoms/',
  edit: (id: string) => `/devices/intercoms/${id}/`,
  delete: (id: string) => `/devices/intercoms/${id}/`,
  deleteMultiple: '/devices/intercoms/',
  details: (id: string) => `/devices/intercoms/${id}/`,
  action: '/devices/intercoms/action/',
}
