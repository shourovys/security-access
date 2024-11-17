export interface ISystemStorage {
  Mount: number
  Total: number
  Free: number
}

export interface ISdStorage {
  Mount: number
  Total: number
  Free: number
}

export interface IUsbStorage {
  Mount: number
  Total: number
  Free: number
}

export interface IDeviceTypeStatus {
  Total: number
  Online: number
  Offline: number
  Normal: number
  Alert: number
}

export interface IDeviceStatuses {
  Node: IDeviceTypeStatus
  Door: IDeviceTypeStatus
  Region: IDeviceTypeStatus
  Input: IDeviceTypeStatus
  Output: IDeviceTypeStatus
  Elevator: IDeviceTypeStatus
  Relay: IDeviceTypeStatus
  Camera: IDeviceTypeStatus
  Gateway: IDeviceTypeStatus
  Channel: IDeviceTypeStatus
  Lockset: IDeviceTypeStatus
  Facegate: IDeviceTypeStatus
  Subnode: IDeviceTypeStatus
  ContLock: IDeviceTypeStatus
  Intercom: IDeviceTypeStatus
}

export interface ISystemStatus {
  CurrentTime: string
  // TimeZone: string
  SystemStorage: ISystemStorage
  SdStorage: ISdStorage
  UsbStorage: IUsbStorage
  SystemName: string
  SystemVersion: string
  LatestVersion: string
  License: string
  Mac: string
  IpAddress: string
  Board1: string
  Board2: string
  DeviceStatus: IDeviceStatuses
}
