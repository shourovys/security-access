export const personApi = {
  list: (queryString: string) => `/persons/persons/?${queryString}`,
  add: '/persons/persons/',
  edit: (id: string) => `/persons/persons/${id}/`,
  groupEdit: '/persons/persons/group/edit/',
  delete: (id: string) => `/persons/persons/${id}/`,
  deleteMultiple: '/persons/persons/',
  details: (id: string) => `/persons/persons/${id}/`,
  export: '/persons/persons/export/',
  import: '/persons/persons/import/',
}
//modified by Imran start
export const personCredentialApi = {
  list: (queryString: string) => `/persons/credientials/?${queryString}`,
  add: `/persons/person/credientials/`,
  edit: (id: string) => `/persons/person/credientials/${id}/`,
  details: (id: string) => `/persons/person/credientials/${id}/`,
}
//modified by Imran end

export const definedFieldApi = {
  list: (queryString: string) => `/persons/fields/?${queryString}`,
  add: '/persons/fields/',
  edit: (id: string) => `/persons/fields/${id}/`,
  delete: (id: string) => `/persons/fields/${id}/`,
  deleteMultiple: '/persons/fields/',
  details: (id: string) => `/persons/fields/${id}/`,
  export: '/persons/fields/export/',
}

export const credentialApi = {
  list: (queryString: string) => `/persons/credientials/?${queryString}`,
  add: '/persons/credientials/',
  edit: (id: string) => `/persons/credientials/${id}/`,
  groupEdit: '/persons/credientials/group_update/',
  bulkLoad: '/persons/credientials/bulk_add/',
  delete: (id: string) => `/persons/credientials/${id}/`,
  deleteMultiple: '/persons/credientials/',
  details: (id: string) => `/persons/credientials/${id}/`,
  export: '/persons/credientials/export/',
  import: '/persons/credientials/import/',
  scan: '/persons/scan/',
  scanData: '/persons/scan_data/',
  invitation: '/persons/credientials/invitation/',
}

export const formatApi = {
  list: (queryString: string) => `/persons/formats/?${queryString}`,
  add: '/persons/formats/',
  edit: (id: string) => `/persons/formats/${id}/`,
  delete: (id: string) => `/persons/formats/${id}/`,
  deleteMultiple: '/persons/formats/',
  details: (id: string) => `/persons/formats/${id}/`,
  export: '/persons/formats/export/',
}

export const accessApi = {
  list: (queryString: string) => `/persons/accesses/?${queryString}`,
  add: '/persons/accesses/',
  edit: (id: string) => `/persons/accesses/${id}/`,
  delete: (id: string) => `/persons/accesses/${id}/`,
  deleteMultiple: '/persons/accesses/',
  details: (id: string) => `/persons/accesses/${id}/`,
  export: '/persons/accesses/export/',
}
