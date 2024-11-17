import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import {
  accessIcon,
  cameraIcon,
  deviceIcon,
  externalIcon,
  maintenanceIcon,
  menuUserIcon,
  monitorIcon,
  reportIcon,
  scheduleIcon,
  serviceIcon,
  settingIcon,
  systemIcon,
} from './icons'

const menuIcons: { [key: string]: IconDefinition } = {
  // favorite: favoriteIcon,
  dashboard: monitorIcon,
  access: accessIcon,
  schedule: scheduleIcon,
  report: reportIcon,
  setting: settingIcon,
  maintenance: maintenanceIcon,
  video: cameraIcon,
  webUser: menuUserIcon,
  device: deviceIcon,
  external: externalIcon,
  service: serviceIcon,
  system: systemIcon,
}
export default menuIcons
