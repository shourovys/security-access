export const partitionApi = {
  list: (queryString: string) => `/users/partitions/?${queryString}`,
  add: '/users/partitions/',
  edit: (id: string) => `/users/partitions/${id}/`,
  delete: (id: string) => `/users/partitions/${id}/`,
  deleteMultiple: '/users/partitions/',
  details: (id: string) => `/users/partitions/${id}/`,
  export: '/users/partitions/export/',
  pages: (id: string) => `/users/partitions/${id}/pages/`,
}

export const userApi = {
  list: (queryString: string) => `/users/users/?${queryString}`,
  add: '/users/users/',
  edit: (id: string) => `/users/users/${id}/`,
  delete: (id: string) => `/users/users/${id}/`,
  deleteMultiple: '/users/users/',
  details: (id: string) => `/users/users/${id}/`,
  export: '/users/users/export/',
}

export const userRoleApi = {
  list: (queryString: string) => `/users/roles/?${queryString}`,
  add: '/users/roles/',
  edit: (id: string) => `/users/roles/${id}/`,
  delete: (id: string) => `/users/roles/${id}/`,
  deleteMultiple: '/users/roles/',
  details: (id: string) => `/users/roles/${id}/`,
  export: '/users/roles/export/',
}
