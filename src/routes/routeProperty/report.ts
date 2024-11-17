import { lazy } from 'react'
import { IRouteProperty } from '../../types/routes'
import {
  accessReportIcon,
  ackReportIcon,
  attendanceReportIcon,
  guardReportIcon,
  logReportIcon,
  occupancyReportIcon,
  smartReportIcon,
  systemReportIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

const SystemReport = lazy(() => import('../../pages/system-report'))
const AccessReport = lazy(() => import('../../pages/access-report'))
const AckReport = lazy(() => import('../../pages/ack-report'))
const LogReport = lazy(() => import('../../pages/log-report'))
const SmartReport = lazy(() => import('../../pages/smart-report'))
const OccupancyReport = lazy(() => import('../../pages/occupancy-report'))
const guardReport = lazy(() => import('../../pages/guard-report'))
const attendanceReport = lazy(() => import('../../pages/attendance-report'))

const reportRouteProperty: IRouteProperty = {
  logReport: {
    id: '5', // ID of "Log Report" in the data
    label: t`Log Report`,
    path: () => '/log-report',
    routePath: '/log-report',
    icon: logReportIcon,
    component: LogReport,
    permissions: ['5'],
  },

  accessReport: {
    id: '6', // ID of "Access Report" in the data
    label: t`Access Report`,
    path: () => '/access-report',
    routePath: '/access-report',
    icon: accessReportIcon,
    component: AccessReport,
    permissions: ['6'],
  },

  ackReport: {
    id: '56', // ID of "ACK Report" in the data
    label: t`ACK Report`,
    path: () => '/ack-report',
    routePath: '/ack-report',
    icon: ackReportIcon,
    component: AckReport,
    permissions: ['56'],
  },

  smartReport: {
    id: '57', // ID of "Smart Report" in the data
    label: 'Smart Report',
    path: () => '/smart-report',
    routePath: '/smart-report',
    icon: smartReportIcon,
    component: SmartReport,
    permissions: ['57'],
  },

  systemReport: {
    id: '1', // ID of "System Report" in the data
    label: t`System Report`,
    path: () => '/system-report',
    routePath: '/system-report',
    icon: systemReportIcon,
    component: SystemReport,
    permissions: ['1'],
  },

  occupancyReport: {
    id: '70', // ID of "Occupancy Report" in the data
    label: 'Occupancy Report',
    path: () => '/occupancy-report',
    routePath: '/occupancy-report',
    icon: occupancyReportIcon,
    component: OccupancyReport,
    permissions: ['70'],
  },

  guardReport: {
    id: '71', // ID of "Guard Report" in the data
    label: 'Guard Report',
    path: () => '/guard-report',
    routePath: '/guard-report',
    icon: guardReportIcon,
    component: guardReport,
    permissions: ['71'],
  },

  attendanceReport: {
    id: '72', // ID of "Attendance Report" in the data
    label: 'Attendance Report',
    path: () => '/attendance-report',
    routePath: '/attendance-report',
    icon: attendanceReportIcon,
    component: attendanceReport,
    permissions: ['72'],
  },
}

export default reportRouteProperty
