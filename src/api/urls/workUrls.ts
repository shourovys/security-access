export const taskApi = {
  list: (queryString: string) => `/works/tasks/?${queryString}`,
  add: '/works/tasks/',
  edit: (id: string) => `/works/tasks/${id}/`,
  delete: (id: string) => `/works/tasks/${id}/`,
  deleteMultiple: '/works/tasks/',
  details: (id: string) => `/works/tasks/${id}/`,
  export: '/works/tasks/export',
  elements: (ActionType: string, ItemSelect: string) =>
    `/works/tasks/elements/?ActionType=${ActionType}&ItemSelect=${ItemSelect}`,
}

export const eventActionApi = {
  list: (queryString: string) => `/works/event_actions/?${queryString}`,
  add: '/works/event_actions/',
  edit: (id: string) => `/works/event_actions/${id}/`,
  delete: (id: string) => `/works/event_actions/${id}/`,
  deleteMultiple: '/works/event_actions/',
  details: (id: string) => `/works/event_actions/${id}/`,
}
export const eventApi = {
  list: (eventActionId: string, queryString: string) =>
    `/works/event_actions/${eventActionId}/events/?${queryString}`,
  add: (eventActionId: string) => `/works/event_actions/${eventActionId}/events/`,
  edit: (eventActionId: string, id: string) =>
    `/works/event_actions/${eventActionId}/events/${id}/`,
  delete: (eventActionId: string, id: string) =>
    `/works/event_actions/${eventActionId}/events/${id}/`,
  deleteMultiple: (eventActionId: string) => `/works/event_actions/${eventActionId}/events/`,
  details: (eventActionId: string, id: string) =>
    `/works/event_actions/${eventActionId}/events/${id}/`,
  elements: (queryString: string) => `/works/event_actions/event/elements/?${queryString}`,
}
export const actionApi = {
  list: (eventActionId: string, queryString: string) =>
    `/works/event_actions/${eventActionId}/actions/?${queryString}`,
  add: (eventActionId: string) => `/works/event_actions/${eventActionId}/actions/`,
  edit: (eventActionId: string, id: string) =>
    `/works/event_actions/${eventActionId}/actions/${id}/`,
  delete: (eventActionId: string, id: string) =>
    `/works/event_actions/${eventActionId}/actions/${id}/`,
  deleteMultiple: (eventActionId: string) => `/works/event_actions/${eventActionId}/actions/`,
  details: (eventActionId: string, id: string) =>
    `/works/event_actions/${eventActionId}/actions/${id}/`,
  elements: (queryString: string) => `/works/event_actions/actions/elements/?${queryString}`,
}

export const eventCodeApi = {
  list: (queryString: string) => `/works/event_codes/?${queryString}`,
  enableDisable: '/works/event_codes/enable_disable/',
}

export const scheduleApi = {
  list: (queryString: string) => `/works/schedules/?${queryString}`,
  add: '/works/schedules/',
  edit: (id: string) => `/works/schedules/${id}/`,
  delete: (id: string) => `/works/schedules/${id}/`,
  deleteMultiple: '/works/schedules/',
  details: (id: string) => `/works/schedules/${id}/`,
}

export const scheduleItemApi = {
  list: (scheduleId: string, queryString: string) =>
    `/works/schedules/${scheduleId}/items/?${queryString}`,
  add: (scheduleId: string) => `/works/schedules/${scheduleId}/items/`,
  edit: (scheduleId: string, id: string) => `/works/schedules/${scheduleId}/items/${id}/`,
  delete: (scheduleId: string, id: string) => `/works/schedules/${scheduleId}/items/${id}/`,
  deleteMultiple: (scheduleId: string) => `/works/schedules/${scheduleId}/items/`,
  details: (scheduleId: string, id: string) => `/works/schedules/${scheduleId}/items/${id}/`,
  import: (scheduleId: string) => `/works/schedules/${scheduleId}/items/import/`,
  getTime: (queryString: string) => `/works/sunrise-sunset-api/?${queryString}`,
}

export const holidayApi = {
  list: (queryString: string) => `/works/holidays/?${queryString}`,
  add: '/works/holidays/',
  edit: (id: string) => `/works/holidays/${id}/`,
  delete: (id: string) => `/works/holidays/${id}/`,
  deleteMultiple: '/works/holidays/',
  details: (id: string) => `/works/holidays/${id}/`,
}

export const holidayItemApi = {
  list: (holidayId: string, queryString: string) =>
    `/works/holidays/${holidayId}/items/?${queryString}`,
  add: (holidayId: string) => `/works/holidays/${holidayId}/items/`,
  edit: (holidayId: string, id: string) => `/works/holidays/${holidayId}/items/${id}/`,
  delete: (holidayId: string, id: string) => `/works/holidays/${holidayId}/items/${id}/`,
  deleteMultiple: (holidayId: string) => `/works/holidays/${holidayId}/items/`,
  details: (holidayId: string, id: string) => `/works/holidays/${holidayId}/items/${id}/`,
  import: (holidayId: string) => `/works/holidays/${holidayId}/items/import/`,
  export: (holidayId: string) => `/works/holidays/${holidayId}/items/exports/`,
}

export const groupApi = {
  list: (queryString: string) => `/works/groups/?${queryString}`,
  add: '/works/groups/',
  edit: (id: string) => `/works/groups/${id}/`,
  delete: (id: string) => `/works/groups/${id}/`,
  deleteMultiple: '/works/groups/',
  details: (id: string) => `/works/groups/${id}/`,
  export: '/works/groups/export/',
}
