import { ISelectOption } from '../../components/atomic/Selector'
import { INvrResult } from './nvr'

export interface IPlaybackFilters {
  Channel: ISelectOption | null
  NvrType: INvrResult['NvrType'] | null
  Time: ISelectOption | null
  Stream: ISelectOption | null
  RecordTime: string
  SelectedRecordedTime: string
  Apply: boolean
}

export interface ISelectedOtherNVRTime {
  Time: string
  Date: string
}

// export interface IPlaybackApiQueryParams {
//   ChannelNo?: string
//   Time?: string
//   Stream?: string
// }
