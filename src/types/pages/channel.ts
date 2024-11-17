import { ISelectOption } from '../../components/atomic/Selector'
import { IPartitionResult, IPartitionResultOld } from '../../types/pages/partition'
import { IApiQueryParamsBase } from './common'
import { INvrResult, INvrResultOld } from './nvr'
import { IThreatResultOld } from './threat'

export interface IChannelResultOld {
  id: number
  partition: IPartitionResultOld
  nvr: INvrResultOld
  threat: IThreatResultOld
  created_at: string
  updated_at: string
  name: string
  description: string
  channel_no: number
}

export interface IChannelResult {
  ChannelNo: number // Primary Key
  Partition: IPartitionResult
  Nvr: INvrResult
  PartitionNo: number // Partitions -> PartitionNo
  ChannelName: string
  ChannelDesc: string
  NvrNo: number // Nvrs -> NvrNo
  ChannelId: string
  Streaming: 0 | 1 // 0: No, 1: Yes
  Online: 0 | 1 // 0: No, 1: Yes
}

export interface IChannelFilters {
  ChannelNo: string
  ChannelName: string
  Partition: ISelectOption | null
  Nvr: ISelectOption | null
  ChannelId: string
  Apply: boolean
}

export interface IChannelRouteQueryParams {
  page: number
  ChannelNo: string
  ChannelName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  NvrValue: string | undefined
  NvrLabel: string | undefined
  ChannelId: string
}

export interface IChannelApiQueryParams extends IApiQueryParamsBase {
  ChannelNo_icontains?: string
  ChannelName_icontains?: string
  PartitionNo?: string
  NvrNo?: string
  ChannelId?: string
}

export interface IChannelFormData {
  ChannelName: string
  ChannelDesc: string
  Partition: ISelectOption | null
  Nvr: ISelectOption | null
  ChannelId: string
  Streaming: ISelectOption | null
  Online?: string
}
