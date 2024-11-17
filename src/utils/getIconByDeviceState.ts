import { IFloorDashboardItems, IFloorDashboardValue } from '../types/pages/floorDashboard'

function getIconByDeviceState(
  type: keyof IFloorDashboardItems,
  device: IFloorDashboardValue
): string {
  switch (type) {
    case 'Node':
      if ('PowerFaultStat' in device && device.PowerFaultStat === 1) {
        return '/node_blinking.png' // Alert + Blinking Red Color
      }
      if ('TamperStat' in device && device.TamperStat === 1) {
        return '/node_blinking.png' // Alert + Blinking Red Color
      }
      if ('Online' in device && !device.Online) {
        return '/node_disable.png' // Offline + Disable Gray Color
      }
      return '/node_normal.png' // Normal

    case 'Door':
      if ('LockStat' in device && 'ContactStat' in device) {
        if (device.LockStat === 0 && device.ContactStat === 0) {
          return '/lock_close.png' // Locked + Close icon
        } else if (device.LockStat === 0 && device.ContactStat === 1) {
          return '/lock_open.png' // Locked + Open icon
        } else if (device.LockStat === 1 && device.ContactStat === 0) {
          return '/unlock_close.png' // Unlocked + Close icon
        } else if (device.LockStat === 1 && device.ContactStat === 1) {
          return '/unlock_Open.png' // Unlocked + Open icon
        }
      }
      if ('AlertStat' in device && (device.AlertStat === 1 || device.AlertStat === 2)) {
        return '/blinking.png' // Alert + Blinking Red Color
      }
      if ('NodeStat' in device && !device.NodeStat) {
        return '/node_disable.png' // Offline + Disable Gray Color
      }
      return '/lock_close.png' // Default icon

    case 'Input':
      if ('InputStat' in device) {
        return device.InputStat === 1 ? '/Input_active.png' : '/Input_Inactive.png' // Active or Inactive icon based on InputStat
      }
      if ('NodeStat' in device && !device.NodeStat) {
        return '/Input_disable.png' // Offline + Disable Gray Color
      }
      return '/Input_Inactive.png' // Default icon

    case 'Output':
      if ('OutputStat' in device) {
        return device.OutputStat === 1 ? '/output_active.png' : '/output_inactive.png' // Active or Inactive icon based on OutputStat
      }
      if ('NodeStat' in device && !device.NodeStat) {
        return '/output_inactive.png' // Offline + Disable Gray Color
      }
      return '/output_inactive.png' // Default icon

    // Add cases for remaining device types
    case 'Elevator':
      if ('NodeStat' in device && !device.NodeStat) {
        return '/elevator_disable.png' // Offline + Disable Gray Color
      }
      return '/elevator_normal.png' // Default icon

    case 'Relay':
      if ('RelayStat' in device) {
        return device.RelayStat === 1 ? '/relay_active.png' : '/relay_Inactive.png' // Active or Inactive icon based on RelayStat
      }
      if ('NodeStat' in device && !device.NodeStat) {
        return '/relay_Inactive.png' // Offline + Disable Gray Color
      }
      return '/relay_Inactive.png' // Default icon

    // case 'Reader':

    case 'Camera':
      if ('RecordStat' in device) {
        return device.RecordStat === 1 ? '/camera_record_on.png' : '/camera_record_off.png' // Active or Inactive icon based on Camera RecordStat
      }
      if ('Online' in device && !device.Online) {
        return '/camera_disable.png' // Offline + Disable Gray Color
      }
      return '/camera_record_off.png' // Default icon

    case 'Channel':
      if ('Streaming' in device) {
        return device.Streaming === 1 ? '/channel_stream_on.png' : '/channel_stream_off.png' // Active or Inactive icon based on Channel Streaming
      }
      if ('Online' in device && !device.Online) {
        return '/channel_disable.png' // Offline + Disable Gray Color
      }
      return '/channel_stream_off.png' // Default icon

    case 'Lockset':
      if ('LockStat' in device) {
        return device.LockStat === 1 ? '/lockset_unlocked.png' : '/lockset_locked.png' // Active or Inactive icon based on Lock SetStat
      }
      if ('Online' in device && !device.Online) {
        return '/lockset_disable.png' // Offline + Disable Gray Color
      }
      return '/lockset_locked.png' // Default icon

    case 'Facegate':
      if ('LockStat' in device) {
        return device.LockStat === 1 ? '/facegate_unlocked.png' : '/facegate_locked.png' // Active or Inactive icon based on Facegate Stat
      }
      if ('Online' in device && !device.Online) {
        return '/facegate_disable.png' // Offline + Disable Gray Color
      }

      return '/facegate_locked.png' // Default icon

    case 'ContLock':
      if ('LockStat' in device) {
        return device.LockStat === 1 ? '/lockset_unlocked.png' : '/lockset_locked.png' // Active or Inactive icon based on ContLock Stat
      }
      if ('Online' in device && !device.Online) {
        return '/lockset_disable.png' // Offline + Disable Gray Color
      }
      return '/lockset_locked.png' // Default icon

    case 'Intercom':
      if ('IntercomStat' in device) {
        return device.IntercomStat === 1 ? '/facegate_unlocked.png' : '/facegate_locked.png' // Active or Inactive icon based on Intercom Stat
      }
      if ('Online' in device && !device.Online) {
        return '/facegate_disable.png' // Offline + Disable Gray Color
      }
      return '/facegate_locked.png' // Default icon

    case 'Trigger':
      return '/trigger.png' // Normal Color

    case 'Threat':
      if ('ThreatLevel' in device && Number(device.ThreatLevel) > 0) {
        return '/threat_blinking.png' //  Alert + Blinking Red Color
      }
      return '/threat_normal.png' // Default icon

    default:
      return '' // Default icon for unknown types
  }
}

// function getIconByDeviceState(
//   type: keyof IFloorDashboardItems,
//   device: IFloorDashboardValue
// ): string {
//  if (type === 'Region') {
//     return ''
//     // return regionIcon
//   } else if (type === 'Input') {
//     return ''
//     // return inputIcon
//   } else if (type === 'Output') {
//     return ''
//     // return outputIcon
//   } else if (type === 'Elevator') {
//     return ''
//     // return elevatorIcon
//   } else if (type === 'Relay') {
//     return ''
//     // return relayIcon
//   } else if (type === 'Camera') {
//     return ''
//     // return cameraIcon
//   } else if (type === 'Nvr') {
//     return ''
//     // return nvrIcon
//   } else if (type === 'Channel') {
//     return ''
//     // return channelIcon
//   } else if (type === 'Gateway') {
//     return ''
//     // return gatewayIcon
//   } else if (type === 'Lockset') {
//     return ''
//     // return locksetIcon
//   } else if (type === 'Facegate') {
//     return ''
//     // return facegateIcon
//   } else if (type === 'Subnode') {
//     return ''
//     // return subnodeIcon
//   } else if (type === 'Reader') {
//     return ''
//     // return readerIcon
//   } else if (type === 'ContGate') {
//     return ''
//     // return contGateIcon
//   } else if (type === 'ContLock') {
//     return ''
//     // return contLockIcon
//   } else if (type === 'Intercom') {
//     return ''
//     // return intercomIcon
//   } else if (type === 'Trigger') {
//     return ''
//     // return triggerIcon
//   } else if (type === 'Threat') {
//     return ''
//     // return threatIcon
//   }

//   // If the type doesn't match any known types, return a default icon
//   return ''
// }

export default getIconByDeviceState
