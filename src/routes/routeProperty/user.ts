import { lazy } from 'react'
import { IRouteProperty } from '../../types/routes'
import { partitionIcon, userIcon, userRoleIcon } from '../../utils/icons'
import t from '../../utils/translator'

const Partition = lazy(() => import('../../pages/partition'))
const CreatePartition = lazy(() => import('../../pages/partition/add'))
const EditPartition = lazy(() => import('../../pages/partition/edit/[id]'))
const PartitionInfo = lazy(() => import('../../pages/partition/info/[id]'))
const User = lazy(() => import('../../pages/user'))
const UserRole = lazy(() => import('../../pages/user-role'))
const CreateUserRole = lazy(() => import('../../pages/user-role/add'))
const EditUserRole = lazy(() => import('../../pages/user-role/edit/[id]'))
const UserRoleInfo = lazy(() => import('../../pages/user-role/info/[id]'))
const CreateUser = lazy(() => import('../../pages/user/add'))
const EditUser = lazy(() => import('../../pages/user/edit/[id]'))
const UserInfo = lazy(() => import('../../pages/user/info/[id]'))

const userRouteProperty: IRouteProperty = {
  // User
  user: {
    id: '8', // ID of "User"
    label: t`User`,
    path: () => '/user',
    routePath: '/user',
    icon: userIcon,
    component: User,
    permissions: ['8'],
  },
  userCreate: {
    path: () => '/user/add',
    routePath: '/user/add',
    component: CreateUser,
    permissions: ['8'],
  },
  userEdit: {
    path: (id?: number | string) => `/user/edit/${id}`,
    routePath: '/user/edit/:id',
    component: EditUser,
    permissions: ['8'],
  },
  userInfo: {
    path: (id?: number | string) => `/user/info/${id}`,
    routePath: '/user/info/:id',
    component: UserInfo,
    permissions: ['8'],
  },

  // User Role
  userRole: {
    id: '9', // ID of "User Role"
    label: t`User Role`,
    path: () => '/user-role',
    routePath: '/user-role',
    icon: userRoleIcon,
    component: UserRole,
    permissions: ['9'],
  },
  userRoleCreate: {
    path: () => '/user-role/add',
    routePath: '/user-role/add',
    component: CreateUserRole,
    permissions: ['9'],
  },
  userRoleEdit: {
    path: (id?: number | string) => `/user-role/edit/${id}`,
    routePath: '/user-role/edit/:id',
    component: EditUserRole,
    permissions: ['9'],
  },
  userRoleInfo: {
    path: (id?: number | string) => `/user-role/info/${id}`,
    routePath: '/user-role/info/:id',
    component: UserRoleInfo,
    permissions: ['9'],
  },

  // Partition
  partition: {
    id: '7', // ID of "Partition"
    label: t`Partition`,
    path: () => '/partition',
    routePath: '/partition',
    icon: partitionIcon,
    component: Partition,
    permissions: ['7'],
  },
  partitionCreate: {
    path: () => '/partition/add',
    routePath: '/partition/add',
    component: CreatePartition,
    permissions: ['7'],
  },
  partitionEdit: {
    path: (id?: number | string) => `/partition/edit/${id}`,
    routePath: '/partition/edit/:id',
    component: EditPartition,
    permissions: ['7'],
  },
  partitionInfo: {
    path: (id?: number | string) => `/partition/info/${id}`,
    routePath: '/partition/info/:id',
    component: PartitionInfo,
    permissions: ['7'],
  },
}

export default userRouteProperty
