import { lazy } from 'react'
import { IRouteProperty } from '../../types/routes'
import {
  accessIcon,
  credentialIcon,
  definedFieldIcon,
  formatIcon,
  personIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

const Access = lazy(() => import('../../pages/access'))
const CreateAccess = lazy(() => import('../../pages/access/add'))
const EditAccess = lazy(() => import('../../pages/access/edit/[id]'))
const AccessInfo = lazy(() => import('../../pages/access/info/[id]'))

const CreatePersonCredential = lazy(() => import('../../pages/credential/add'))
const PersonCredentialEdit = lazy(() => import('../../pages/credential/edit/[id]'))
const PersonCredentialInfo = lazy(() => import('../../pages/credential/info/[id]'))

const Credential = lazy(() => import('../../pages/credential'))
const CreateCredential = lazy(() => import('../../pages/credential/add'))
const BulkLoadCredential = lazy(() => import('../../pages/credential/bulk-load'))
const EditCredential = lazy(() => import('../../pages/credential/edit/[id]'))
const CredentialGroupEdit = lazy(() => import('../../pages/credential/group-edit'))
const CredentialInfo = lazy(() => import('../../pages/credential/info/[id]'))

const DefinedField = lazy(() => import('../../pages/defined-field'))
const CreateDefinedField = lazy(() => import('../../pages/defined-field/add'))
const EditDefinedField = lazy(() => import('../../pages/defined-field/edit/[id]'))
const DefinedFieldInfo = lazy(() => import('../../pages/defined-field/info/[id]'))
const Format = lazy(() => import('../../pages/format'))
const CreateFormat = lazy(() => import('../../pages/format/add'))
const EditFormat = lazy(() => import('../../pages/format/edit/[id]'))
const FormatInfo = lazy(() => import('../../pages/format/info/[id]'))
const Person = lazy(() => import('../../pages/person'))
const CreatePerson = lazy(() => import('../../pages/person/add'))
const EditPerson = lazy(() => import('../../pages/person/edit/[id]'))
const PersonInfo = lazy(() => import('../../pages/person/info/[id]'))
const GroupEditPerson = lazy(() => import('../../pages/person/group-edit'))

const accessRouteProperty: IRouteProperty = {
  // person
  person: {
    // ID of "Persons" from the original data: 10
    id: '10',
    label: t`Person`,
    path: () => '/person',
    routePath: '/person',
    icon: personIcon,
    component: Person,
    permissions: ['10'],
  },
  personCreate: {
    path: () => '/person/add',
    routePath: '/person/add',
    component: CreatePerson,
    permissions: ['10'],
  },
  personEdit: {
    path: (id?: number | string) => `/person/edit/${id}`,
    routePath: '/person/edit/:id',
    component: EditPerson,
    permissions: ['10'],
  },
  personGroupEdit: {
    path: (ids?: number | string) => `/person/group-edit?ids=${ids}`,
    routePath: '/person/group-edit',
    component: GroupEditPerson,
    permissions: ['10'],
  },
  personInfo: {
    path: (id?: number | string) => `/person/info/${id}`,
    routePath: '/person/info/:id',
    component: PersonInfo,
    permissions: ['10'],
  },

  personCredentialCreate: {
    path: (personId?: string | number) => `/person/credential/add?personId=${personId}`,
    routePath: '/person/credential/add',
    component: CreatePersonCredential,
    permissions: ['10'],
  },
  personCredentialEdit: {
    path: (id?: number | string, personId?: string | number) =>
      `/person/credential/edit/${id}?personId=${personId}`,
    routePath: '/person/credential/edit/:id',
    component: PersonCredentialEdit,
    permissions: ['10'],
  },
  personCredentialInfo: {
    path: (id?: number | string, personId?: string | number) =>
      `/person/credential/info/${id}?personId=${personId}`,
    routePath: '/person/credential/info/:id',
    component: PersonCredentialInfo,
    permissions: ['10'],
  },

  // definedField
  definedField: {
    // ID of "Defined Field" from the original data: 11
    id: '11',
    label: t`Defined Field`,
    path: () => '/defined-field',
    routePath: '/defined-field',
    icon: definedFieldIcon,
    component: DefinedField,
    permissions: ['11'],
  },
  definedFieldCreate: {
    path: () => '/defined-field/add',
    routePath: '/defined-field/add',
    component: CreateDefinedField,
    permissions: ['11'],
  },
  definedFieldEdit: {
    path: (id?: number | string) => `/defined-field/edit/${id}`,
    routePath: '/defined-field/edit/:id',
    component: EditDefinedField,
    permissions: ['11'],
  },
  definedFieldInfo: {
    path: (id?: number | string) => `/defined-field/info/${id}`,
    routePath: '/defined-field/info/:id',
    component: DefinedFieldInfo,
    permissions: ['11'],
  },

  // credential
  credential: {
    // ID of "Credential" from the original data: 12
    id: '12',
    label: t`Credential`,
    path: () => '/credential',
    routePath: '/credential',
    icon: credentialIcon,
    component: Credential,
    permissions: ['12'],
  },

  credentialCreate: {
    // pass person id if you need to hide person form in credential add
    path: (personId?: string | number) =>
      personId ? `/credential/add?personId=${personId}` : '/credential/add',
    routePath: '/credential/add',
    component: CreateCredential,
    permissions: ['12'],
  },
  credentialBulkLoad: {
    path: () => '/credential/bulk-load',
    routePath: '/credential/bulk-load',
    component: BulkLoadCredential,
    permissions: ['12'],
  },
  credentialEdit: {
    path: (id?: number | string, personId?: string | number) =>
      personId ? `/credential/edit/${id}?personId=${personId}` : `/credential/edit/${id}`,
    routePath: '/credential/edit/:id',
    component: EditCredential,
    permissions: ['12'],
  },
  credentialGroupEdit: {
    path: (ids?: number | string) => `/credential/group-edit?ids=${ids}`,
    routePath: '/credential/group-edit',
    component: CredentialGroupEdit,
    permissions: ['12'],
  },
  credentialInfo: {
    path: (id?: number | string, personId?: string | number) =>
      personId ? `/credential/info/${id}?personId=${personId}` : `/credential/info/${id}`,
    routePath: '/credential/info/:id',
    component: CredentialInfo,
    permissions: ['12'],
  },

  // format
  format: {
    id: '13', // ID of "Format"
    label: t`Format`,
    path: () => '/format',
    routePath: '/format',
    icon: formatIcon,
    component: Format,
    permissions: ['13'],
  },
  formatCreate: {
    path: () => '/format/add',
    routePath: '/format/add',
    component: CreateFormat,
    permissions: ['13'],
  },
  formatEdit: {
    path: (id?: number | string) => `/format/edit/${id}`,
    routePath: '/format/edit/:id',
    component: EditFormat,
    permissions: ['13'],
  },
  formatInfo: {
    path: (id?: number | string) => `/format/info/${id}`,
    routePath: '/format/info/:id',
    component: FormatInfo,
    permissions: ['13'],
  },

  // Access
  access: {
    id: '14', // ID of "Access"
    label: t`Access`,
    path: () => '/access',
    routePath: '/access',
    icon: accessIcon,
    component: Access,
    permissions: ['14'],
  },
  accessCreate: {
    path: () => '/access/add',
    routePath: '/access/add',
    component: CreateAccess,
    permissions: ['14'],
  },
  accessEdit: {
    path: (id?: number | string) => `/access/edit/${id}`,
    routePath: '/access/edit/:id',
    component: EditAccess,
    permissions: ['14'],
  },
  accessInfo: {
    path: (id?: number | string) => `/access/info/${id}`,
    routePath: '/access/info/:id',
    component: AccessInfo,
    permissions: ['14'],
  },
}
export default accessRouteProperty
