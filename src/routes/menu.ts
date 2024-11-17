// eslint-disable-next-line react/jsx-filename-extension
import {
  IAllRoutesInGroup,
  ILabeledRoute,
  ILabeledRoutes,
  IRoute,
  IRouteProperty,
  IRoutesArrayInGroup,
} from '../types/routes'
import accessRouteProperty from './routeProperty/access'
import dashboardRouteProperty from './routeProperty/dashboard'
import deviceRouteProperty from './routeProperty/device'
import externalRouteProperty from './routeProperty/external'
import maintenanceRouteProperty from './routeProperty/maintenance'
import reportRouteProperty from './routeProperty/report'
import scheduleRouteProperty from './routeProperty/schedule'
import serviceRouteProperty from './routeProperty/service'
import systemRouteProperty from './routeProperty/system'
import userRouteProperty from './routeProperty/user'
import videoRouteProperty from './routeProperty/video'

export const allRoutesInGroup: IAllRoutesInGroup = {
  dashboard: {
    ...dashboardRouteProperty, // dashboard, ack, floor
  },
  video: {
    ...videoRouteProperty, // live, playback, camera, nvr, channel, view,
  },
  access: {
    ...accessRouteProperty, // person, definedField, credential, format, access
  },
  schedule: {
    ...scheduleRouteProperty, // schedule, task, eventAction, eventCode, holiday, group,
  },
  report: {
    ...reportRouteProperty, // logReport, accessReport, ackReport, smartReport, systemReport, occupancyReportApi, guardReport, attendanceReport
  },
  maintenance: {
    ...maintenanceRouteProperty, // update, backup, backupSchedule, restore, archive, archiveSchedule, getBack, default, database, reboot, miscellaneous,
  },
  device: {
    ...deviceRouteProperty, // node, nodeScan, door, doorRule, region, input, output, elevator, relay, trigger, threat
  },
  external: {
    ...externalRouteProperty, // gateway, lockset, facegate, serial, subnode,
  },
  webUser: {
    ...userRouteProperty, // user, userRole, partition
  },
  service: {
    ...serviceRouteProperty, // email, ftp, restAPI, logAPI, gemini, sip, invite
  },
  system: {
    ...systemRouteProperty, // license, system, network, time
  },
}

export const routesArrayInGroup: IRoutesArrayInGroup = Object.entries(allRoutesInGroup)
  .map(([groupKey, groupValue]: [string, IRouteProperty]) => {
    const labeledRoute: IRoute[] = Object.values(groupValue).filter((route) => route)
    return [groupKey, labeledRoute] as [string, IRoute[]]
  })
  .reduce((acc: IRoutesArrayInGroup, [groupKey, labeledRoutes]: [string, IRoute[]]) => {
    return { ...acc, [groupKey]: labeledRoutes }
  }, {})

const labeledRoutes: ILabeledRoutes = Object.entries(allRoutesInGroup)
  .map(([key, value]: [string, IRouteProperty]) => {
    const labeledRoute = Object.values(value).filter((obj) => {
      return Object.prototype.hasOwnProperty.call(obj, 'label') && obj.label !== ''
    })
    return [key, labeledRoute] as [string, ILabeledRoute[]]
  })
  .reduce((previousValue: ILabeledRoutes, [key, value]: [string, ILabeledRoute[]]) => {
    return { ...previousValue, [key]: value }
  }, {})
export default labeledRoutes
