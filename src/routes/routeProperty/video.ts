import { lazy } from 'react'
import { IRouteProperty } from '../../types/routes'
import {
  ackIcon,
  cameraIcon,
  channelIcon,
  // favoriteIcon,
  floorDashboardIcon,
  floorIcon,
  liveIcon,
  nvrIcon,
  playbackIcon,
  viewIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

// const FavoriteEdit = lazy(() => import('../../pages/favorite'))
const Playback = lazy(() => import('../../pages/playback'))
const LivePage = lazy(() => import('../../pages/live'))
const View = lazy(() => import('../../pages/view'))
const CreateView = lazy(() => import('../../pages/view/add'))
const EditView = lazy(() => import('../../pages/view/edit/[id]'))
const ViewInfo = lazy(() => import('../../pages/view/info/[id]'))

const NVR = lazy(() => import('../../pages/nvr'))
const CreateNvr = lazy(() => import('../../pages/nvr/add'))
const EditNvr = lazy(() => import('../../pages/nvr/edit/[id]'))
const NvrInfo = lazy(() => import('../../pages/nvr/info/[id]'))

const Camera = lazy(() => import('../../pages/camera'))
const CreateCamera = lazy(() => import('../../pages/camera/add'))
const EditCamera = lazy(() => import('../../pages/camera/edit/[id]'))
const CameraInfo = lazy(() => import('../../pages/camera/info/[id]'))

const Channel = lazy(() => import('../../pages/channel'))
const CreateChannel = lazy(() => import('../../pages/channel/add'))
const EditChannel = lazy(() => import('../../pages/channel/edit/[id]'))
const ChannelInfo = lazy(() => import('../../pages/channel/info/[id]'))

const videoRouteProperty: IRouteProperty = {
  // Live
  live: {
    id: '3',
    label: t`Live`,
    path: () => '/live',
    routePath: '/live',
    icon: liveIcon,
    component: LivePage,
    permissions: ['3'],
  },

  // Playback
  playback: {
    id: '4',
    label: t`Playback`,
    path: () => '/playback',
    routePath: '/playback',
    icon: playbackIcon,
    component: Playback,
    permissions: ['4'],
  },

  // Camera
  camera: {
    id: '22',
    label: t`Camera`,
    path: () => '/camera',
    routePath: '/camera',
    icon: cameraIcon,
    component: Camera,
    permissions: ['22'],
  },
  cameraCreate: {
    path: () => '/camera/add',
    routePath: '/camera/add',
    component: CreateCamera,
    permissions: ['22'],
  },
  cameraEdit: {
    path: (id?: number | string) => `/camera/edit/${id}`,
    routePath: '/camera/edit/:id',
    component: EditCamera,
    permissions: ['22'],
  },
  cameraInfo: {
    path: (id?: number | string) => `/camera/info/${id}`,
    routePath: '/camera/info/:id',
    component: CameraInfo,
    permissions: ['22'],
  },
  // NVR
  nvr: {
    id: '23',
    label: t`NVR`,
    path: () => '/nvr',
    routePath: '/nvr',
    icon: nvrIcon,
    component: NVR,
    permissions: ['23'],
  },
  nvrCreate: {
    path: () => '/nvr/add',
    routePath: '/nvr/add',
    component: CreateNvr,
    permissions: ['23'],
  },
  nvrEdit: {
    path: (id?: number | string) => `/nvr/edit/${id}`,
    routePath: '/nvr/edit/:id',
    component: EditNvr,
    permissions: ['23'],
  },
  nvrInfo: {
    path: (id?: number | string) => `/nvr/info/${id}`,
    routePath: '/nvr/info/:id',
    component: NvrInfo,
    permissions: ['23'],
  },

  // Channel
  channel: {
    id: '24',
    label: t`Channel`,
    path: () => '/channel',
    routePath: '/channel',
    icon: channelIcon,
    component: Channel,
    permissions: ['24'],
  },
  channelCreate: {
    path: () => '/channel/add',
    routePath: '/channel/add',
    component: CreateChannel,
    permissions: ['24'],
  },
  channelEdit: {
    path: (id?: number | string) => `/channel/edit/${id}`,
    routePath: '/channel/edit/:id',
    component: EditChannel,
    permissions: ['24'],
  },
  channelInfo: {
    path: (id?: number | string) => `/channel/info/${id}`,
    routePath: '/channel/info/:id',
    component: ChannelInfo,
    permissions: ['24'],
  },

  // view
  view: {
    id: '39',
    label: t`View`,
    path: () => '/view',
    routePath: '/view',
    icon: viewIcon,
    component: View,
    permissions: ['39'],
  },
  viewCreate: {
    path: () => '/view/add',
    routePath: '/view/add',
    component: CreateView,
    permissions: ['39'],
  },
  viewEdit: {
    path: (id?: number | string) => `/view/edit/${id}`,
    routePath: '/view/edit/:id',
    component: EditView,
    permissions: ['39'],
  },
  viewInfo: {
    path: (id?: number | string) => `/view/info/${id}`,
    routePath: '/view/info/:id',
    component: ViewInfo,
    permissions: ['39'],
  },
}

export default videoRouteProperty
