import { lazy } from 'react'
import { IRouteProperty } from '../../types/routes'
import {
  ackIcon,
  // favoriteIcon,
  floorDashboardIcon,
  floorIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

// const FavoriteEdit = lazy(() => import('../../pages/favorite'))
const FloorDashboard = lazy(() => import('../../pages/dashboard'))
const Dashboard = lazy(() => import('../../pages'))
const LogInfo = lazy(() => import('../../pages/log/info/[id]'))
const ACK = lazy(() => import('../../pages/ack'))
const Floor = lazy(() => import('../../pages/floor'))
const CreateFloor = lazy(() => import('../../pages/floor/add'))
const EditFloor = lazy(() => import('../../pages/floor/edit/[id]'))
const FloorInfo = lazy(() => import('../../pages/floor/info/[id]'))
const EditFloorInfo = lazy(() => import('../../pages/floor/info/edit/[id]'))

const dashboardRouteProperty: IRouteProperty = {
  // Floor Dashboard
  dashboard: {
    path: () => '/',
    routePath: '/',
    component: Dashboard,
    permissions: ['2'],
  },
  // Floor Dashboard
  floorDashboard: {
    id: '2',
    label: t`Dashboard`,
    path: () => '/dashboard',
    routePath: '/dashboard',
    icon: floorDashboardIcon,
    component: FloorDashboard,
    permissions: ['2'],
  },
  logInfo: {
    path: (id?: number | string, Reference?: number | string) =>
      `/log/info/${id}?Reference=${Reference}`,
    routePath: '/log/info/:id',
    component: LogInfo,
    permissions: ['2'],
  },

  // ACK
  ack: {
    id: '55',
    label: t`ACK`,
    path: () => '/ack',
    routePath: '/ack',
    icon: ackIcon,
    component: ACK,
    permissions: ['55'],
  },

  // floor
  floor: {
    id: '38',
    label: t`Floor`,
    path: () => '/floor',
    routePath: '/floor',
    icon: floorIcon,
    component: Floor,
    permissions: ['38'],
  },
  floorCreate: {
    path: () => '/floor/add',
    routePath: '/floor/add',
    component: CreateFloor,
    permissions: ['38'],
  },
  floorEdit: {
    path: (id?: number | string) => `/floor/edit/${id}`,
    routePath: '/floor/edit/:id',
    component: EditFloor,
    permissions: ['38'],
  },
  floorInfo: {
    path: (id?: number | string) => `/floor/info/${id}`,
    routePath: '/floor/info/:id',
    component: FloorInfo,
    permissions: ['38'],
  },
  floorInfoEdit: {
    path: (id?: number | string) => `/floor/info/edit/${id}`,
    routePath: '/floor/info/edit/:id',
    component: EditFloorInfo,
    permissions: ['38'],
  },
  // floorView: {
  //     path: (id?: number | string) => `/floor/view/${id}`,
  //     routePath: "/floor/view/:id",
  //     component: ViewFloor,
  //     permissions: ['38'],
  // },

  // favorite
  // favorite: {
  //   id: '', // No ID available for this URL
  //   label: '',
  //   path: () => '/favorite',
  //   routePath: '/favorite',
  //   icon: favoriteIcon,
  //   component: FavoriteEdit,
  //   permissions: '*',
  // },
}

export default dashboardRouteProperty
