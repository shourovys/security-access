import optionsToObject from '../../utils/optionsToObject'
import t from '../../utils/translator'

// export interface ILogResultOld {
//   id: string
//   channel: IChannelResultOld | null
//   credential: ICredentialResultOld
//   event_code: IEventCodeResultOld
//   format: IFormatResultOld
//   partition: IPartitionResultOld
//   person: IPersonResultOld
//   region: IRegionResultOld
//   created_at: string
//   updated_at: string
//   log_time: string
//   event_time: string
//   event_name: string
//   device_type: number
//   device_no: number
//   device_name: string
//   credential_numb: string
//   person_name: string
//   reader_port: number
//   message: string
//   ack_required: number
//   ack_time: number
//   ack_user: string
//   comment: string
//   log_sent: number
// }

export interface ILogResult {
  LogNo: number
  Partition: {
    PartitionNo: number
    PartitionName: string
  } | null
  Format: {
    FormatNo: number
    FormatName: string
  } | null
  Credential: {
    CredentialNo: number
    CredentialName: string
  } | null
  Person: {
    PersonNo: number
    PersonName: string
  } | null
  Region: {
    RegionNo: number
    RegionName: string
  } | null
  Channel: {
    ChannelNo: number
    ChannelName: string
  } | null
  PartitionNo: number
  LogTime: number
  EventTime: number
  EventCode: number
  EventName: string
  DeviceType: number
  DeviceNo: number
  DeviceName: string
  FormatNo: number
  CredentialNumb: string
  CredentialNo: number
  PersonNo: number
  PersonName: string
  ReaderPort: number
  RegionNo: number
  ChannelNo: number
  Message: string
  AckRequired: boolean
  AckTime: number
  AckUser: string
  Comment: string
  LogSent: number
}

export interface ILogFormData {
  LogNo: string
  Partition: string
  LogTime: number
  EventTime: number
  EventCode: string
  EventName: string
  DeviceType: string
  DeviceName: string
  DeviceNo: number
  FormatName: string
  CredentialNumb: string
  CredentialNo: number
  PersonName: string
  PersonNo: number
  ReaderPort: string
  RegionName: string
  ChannelName: string
  Message: string
  AckRequired: boolean
  AckTime: number
  AckUser: string
  Comment: string
  LogSent: string
}

export const logDeviceTypeOptions = [
  { value: '1', label: t`Node` },
  { value: '2', label: t('Door') },
  { value: '3', label: t`Region` },
  { value: '4', label: t`Input` },
  { value: '5', label: t('Output') },
  { value: '6', label: t('Elevator') },
  { value: '7', label: t('Relay') },
  { value: '8', label: t`Camera` },
  { value: '9', label: t`Nvr` },
  { value: '10', label: t('Channel') },
  { value: '11', label: t('Gateway') },
  { value: '12', label: t('Lockset') },
  { value: '13', label: t('Facegate') },
  { value: '14', label: t('Subnode') },
  { value: '15', label: t`Reader` },
  { value: '16', label: t`ContGate` },
  { value: '17', label: t`ContLock` },
  { value: '18', label: t`Intercom` },
  { value: '98', label: t`Trigger` },
  { value: '99', label: t`Threat` },
]

export const logDeviceTypeObject = optionsToObject(logDeviceTypeOptions)
