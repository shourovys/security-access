import { lazy } from 'react'
import { IRouteProperty } from '../../types/routes'
import {
  cameraIcon,
  channelIcon,
  contGateIcon,
  contLockIcon,
  facegateIcon,
  gatewayIcon,
  intercomIcon,
  locksetIcon,
  nvrIcon,
  readerIcon,
  subnodeIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

const Facegate = lazy(() => import('../../pages/facegate'))
const CreateFacegate = lazy(() => import('../../pages/facegate/add'))
const EditFacegate = lazy(() => import('../../pages/facegate/edit/[id]'))
const FacegateInfo = lazy(() => import('../../pages/facegate/info/[id]'))

const Gateway = lazy(() => import('../../pages/gateway'))
const CreateGateway = lazy(() => import('../../pages/gateway/add'))
const EditGateway = lazy(() => import('../../pages/gateway/edit/[id]'))
const GatewayInfo = lazy(() => import('../../pages/gateway/info/[id]'))

const Lockset = lazy(() => import('../../pages/lockset'))
const CreateLockset = lazy(() => import('../../pages/lockset/add'))
const EditLockset = lazy(() => import('../../pages/lockset/edit/[id]'))
const LocksetInfo = lazy(() => import('../../pages/lockset/info/[id]'))

// const Serial = lazy(() => import('../../pages/serial'));
// const CreateSerial = lazy(() => import('../../pages/serial/add'));
// const EditSerial = lazy(() => import('../../pages/serial/edit/[id]'));
// const SerialInfo = lazy(() => import('../../pages/serial/info/[id]'));
const Subnode = lazy(() => import('../../pages/subnode'))
const CreateSubnode = lazy(() => import('../../pages/subnode/add'))
const EditSubnode = lazy(() => import('../../pages/subnode/edit/[id]'))
const SubnodeInfo = lazy(() => import('../../pages/subnode/info/[id]'))

const Reader = lazy(() => import('../../pages/reader'))
// const CreateReader = lazy(() => import('../../pages/reader/add'))
const EditReader = lazy(() => import('../../pages/reader/edit/[id]'))
const ReaderInfo = lazy(() => import('../../pages/reader/info/[id]'))

const ContGate = lazy(() => import('../../pages/contgate'))
const CreateContGate = lazy(() => import('../../pages/contgate/add'))
const EditContGate = lazy(() => import('../../pages/contgate/edit/[id]'))
const ContGateInfo = lazy(() => import('../../pages/contgate/info/[id]'))

const ContLock = lazy(() => import('../../pages/contlock'))
const CreateContLock = lazy(() => import('../../pages/contlock/add'))
const EditContLock = lazy(() => import('../../pages/contlock/edit/[id]'))
const ContLockInfo = lazy(() => import('../../pages/contlock/info/[id]'))

const Intercom = lazy(() => import('../../pages/intercom'))
const CreateIntercom = lazy(() => import('../../pages/intercom/add'))
const EditIntercom = lazy(() => import('../../pages/intercom/edit/[id]'))
const IntercomInfo = lazy(() => import('../../pages/intercom/info/[id]'))

const externalRouteProperty: IRouteProperty = {
  // Gateway
  gateway: {
    id: '25',
    label: t`Gateway`,
    path: () => '/gateway',
    routePath: '/gateway',
    icon: gatewayIcon,
    component: Gateway,
    permissions: ['25'],
  },
  gatewayCreate: {
    path: () => '/gateway/add',
    routePath: '/gateway/add',
    component: CreateGateway,
    permissions: ['25'],
  },
  gatewayEdit: {
    path: (id?: number | string) => `/gateway/edit/${id}`,
    routePath: '/gateway/edit/:id',
    component: EditGateway,
    permissions: ['25'],
  },
  gatewayInfo: {
    path: (id?: number | string) => `/gateway/info/${id}`,
    routePath: '/gateway/info/:id',
    component: GatewayInfo,
    permissions: ['25'],
  },

  // Lockset
  lockset: {
    id: '26',
    label: t`Lockset`,
    path: () => '/lockset',
    routePath: '/lockset',
    icon: locksetIcon,
    component: Lockset,
    permissions: ['26'],
  },
  locksetCreate: {
    path: () => '/lockset/add',
    routePath: '/lockset/add',
    component: CreateLockset,
    permissions: ['26'],
  },
  locksetEdit: {
    path: (id?: number | string) => `/lockset/edit/${id}`,
    routePath: '/lockset/edit/:id',
    component: EditLockset,
    permissions: ['26'],
  },
  locksetInfo: {
    path: (id?: number | string) => `/lockset/info/${id}`,
    routePath: '/lockset/info/:id',
    component: LocksetInfo,
    permissions: ['26'],
  },

  // Facegate
  facegate: {
    id: '60',
    label: t`Facegate`,
    path: () => '/facegate',
    routePath: '/facegate',
    icon: facegateIcon,
    component: Facegate,
    permissions: ['60'],
  },
  facegateCreate: {
    path: () => '/facegate/add',
    routePath: '/facegate/add',
    component: CreateFacegate,
    permissions: ['60'],
  },
  facegateEdit: {
    path: (id?: number | string) => `/facegate/edit/${id}`,
    routePath: '/facegate/edit/:id',
    component: EditFacegate,
    permissions: ['60'],
  },
  facegateInfo: {
    path: (id?: number | string) => `/facegate/info/${id}`,
    routePath: '/facegate/info/:id',
    component: FacegateInfo,
    permissions: ['60'],
  },

  // Serial
  // serial: {
  //  id:''
  //   label: t('Serial',
  //   path: () => '/serial',
  //   routePath: '/serial',
  //   icon: serialIcon,
  //   component: Serial,
  //   permissions: PERMISSIONS.serial,
  // },
  // serialCreate: {
  //   path: () => '/serial/add',
  //   routePath: '/serial/add',
  //   component: CreateSerial,
  //   permissions: PERMISSIONS.serial,
  // },
  // serialEdit: {
  //   path: (id?: number | string) => `/serial/edit/${id}`,
  //   routePath: '/serial/edit/:id',
  //   component: EditSerial,
  //   permissions: PERMISSIONS.serial,
  // },
  // serialInfo: {
  //   path: (id?: number | string) => `/serial/info/${id}`,
  //   routePath: '/serial/info/:id',
  //   component: SerialInfo,
  //   permissions: PERMISSIONS.serial,
  // },

  // Subnode
  subnode: {
    id: '63',
    label: t`Subnode`,
    path: () => '/subnode',
    routePath: '/subnode',
    icon: subnodeIcon,
    component: Subnode,
    permissions: ['63'],
  },
  subnodeCreate: {
    path: () => '/subnode/add',
    routePath: '/subnode/add',
    component: CreateSubnode,
    permissions: ['63'],
  },
  subnodeEdit: {
    path: (id?: number | string) => `/subnode/edit/${id}`,
    routePath: '/subnode/edit/:id',
    component: EditSubnode,
    permissions: ['63'],
  },
  subnodeInfo: {
    path: (id?: number | string) => `/subnode/info/${id}`,
    routePath: '/subnode/info/:id',
    component: SubnodeInfo,
    permissions: ['63'],
  },

  // Reader
  reader: {
    id: '64',
    label: t`Reader`,
    path: () => '/reader',
    routePath: '/reader',
    icon: readerIcon,
    component: Reader,
    permissions: ['64'],
  },
  // readerCreate: {
  //   path: () => '/reader/add',
  //   routePath: '/reader/add',
  //   component: CreateReader,
  //   permissions: ['64']
  // },
  readerEdit: {
    path: (id?: number | string) => `/reader/edit/${id}`,
    routePath: '/reader/edit/:id',
    component: EditReader,
    permissions: ['64'],
  },
  readerInfo: {
    path: (id?: number | string) => `/reader/info/${id}`,
    routePath: '/reader/info/:id',
    component: ReaderInfo,
    permissions: ['64'],
  },

  // ContGate
  contGate: {
    id: '65',
    label: t`ContGate`,
    path: () => '/contgate',
    routePath: '/contgate',
    icon: contGateIcon,
    component: ContGate,
    permissions: ['65'],
  },
  contGateCreate: {
    path: () => '/contgate/add',
    routePath: '/contgate/add',
    component: CreateContGate,
    permissions: ['65'],
  },
  contGateEdit: {
    path: (id?: number | string) => `/contgate/edit/${id}`,
    routePath: '/contgate/edit/:id',
    component: EditContGate,
    permissions: ['65'],
  },
  contGateInfo: {
    path: (id?: number | string) => `/contgate/info/${id}`,
    routePath: '/contgate/info/:id',
    component: ContGateInfo,
    permissions: ['65'],
  },

  // ContLock
  contLock: {
    id: '66',
    label: t`ContLock`,
    path: () => '/contlock',
    routePath: '/contlock',
    icon: contLockIcon,
    component: ContLock,
    permissions: ['66'],
  },
  contLockCreate: {
    path: () => '/contlock/add',
    routePath: '/contlock/add',
    component: CreateContLock,
    permissions: ['66'],
  },
  contLockEdit: {
    path: (id?: number | string) => `/contlock/edit/${id}`,
    routePath: '/contlock/edit/:id',
    component: EditContLock,
    permissions: ['66'],
  },
  contLockInfo: {
    path: (id?: number | string) => `/contlock/info/${id}`,
    routePath: '/contlock/info/:id',
    component: ContLockInfo,
    permissions: ['66'],
  },

  // Intercom
  intercom: {
    id: '69',
    label: t`Intercom`,
    path: () => '/intercom',
    routePath: '/intercom',
    icon: intercomIcon,
    component: Intercom,
    permissions: ['69'],
  },
  intercomCreate: {
    path: () => '/intercom/add',
    routePath: '/intercom/add',
    component: CreateIntercom,
    permissions: ['69'],
  },
  intercomEdit: {
    path: (id?: number | string) => `/intercom/edit/${id}`,
    routePath: '/intercom/edit/:id',
    component: EditIntercom,
    permissions: ['69'],
  },
  intercomInfo: {
    path: (id?: number | string) => `/intercom/info/${id}`,
    routePath: '/intercom/info/:id',
    component: IntercomInfo,
    permissions: ['69'],
  },
}
export default externalRouteProperty
