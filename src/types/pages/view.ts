import { ISelectOption } from '../../components/atomic/Selector'
import { IChannelResult } from './channel'
import { IApiQueryParamsBase } from './common'
import { IPartitionResult } from './partition'

// export interface IViewResultOld {
//   id: number
//   partition: IPartitionResultOld
//   channels: IChannelResultOld[]
//   created_at: string
//   updated_at: string
//   name: string
//   description: string
// }
export interface IViewResult {
  ViewNo: number
  Channels: IChannelResult[]
  PartitionNo: number
  Partition: IPartitionResult
  ViewName: string
  ViewDesc: string
}

export interface IViewFilters {
  ViewNo: string
  ViewName: string
  Partition: ISelectOption | null
  Apply: boolean
}

export interface IViewRouteQueryParams {
  page: number
  ViewNo: string
  ViewName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
}

export interface IViewApiQueryParams extends IApiQueryParamsBase {
  ViewNo_icontains?: string
  ViewName_icontains?: string
  PartitionNo?: string
}

export interface IViewFormData {
  ViewName: string
  ViewDesc: string
  Partition: ISelectOption | null
  ChannelNos: string[]
  Channels?: IChannelResult[]
}
