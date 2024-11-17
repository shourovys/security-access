import { IRoute, IRouteProperty } from '../../types/routes'
import accessRouteProperty from './access'
import authRouteProperty from './auth'
import monitorRouteProperty from './dashboard'
import deviceRouteProperty from './device'
import externalRouteProperty from './external'
import maintenanceRouteProperty from './maintenance'
import reportRouteProperty from './report'
import scheduleRouteProperty from './schedule'
import serviceRouteProperty from './service'
import systemRouteProperty from './system'
import userRouteProperty from './user'
import videoRouteProperty from './video'

const routeProperty: IRouteProperty = {
  ...monitorRouteProperty, // dashboard, ack, floor
  ...videoRouteProperty, // live, playback, camera, nvr, channel, view
  ...accessRouteProperty, // person, definedField, credential, format, access
  ...scheduleRouteProperty, // schedule, task, eventAction, eventCode, holiday, group,
  ...reportRouteProperty, // logReport, accessReport, ackReport, smartReport, systemReport, occupancyReportApi, guardReport, attendanceReport
  ...maintenanceRouteProperty, // update, backup, backupSchedule, restore, archive, archiveSchedule, getBack, default, database, reboot, miscellaneous,
  ...deviceRouteProperty, // node, nodeScan, door, doorRule, region, input, output, elevator, relay, trigger, threat
  ...externalRouteProperty, // gateway, lockset, facegate, serial, subnode,
  ...userRouteProperty, // user, userRole, partition
  ...serviceRouteProperty, // email, ftp, restAPI, logAPI, gemini, sip
  ...systemRouteProperty, // license, system, network, time
  ...authRouteProperty, // login, profile, favorite
}
export default routeProperty

const ReactRoutes: IRoute[] = Object.entries(routeProperty).map(
  ([, value]: [string, IRoute]) => value
)

export { ReactRoutes }

// console.log(ReactRoutes.map((route) => 'http://localhost:3000' + route.path(1, 1)))
