import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import t from '../../utils/translator'

export interface IEventCodeResultOld {
  id: number
  created_at: string
  updated_at: string
  name: string
  description: string
  event_type: number
  event_level: number
  log_save: boolean
  log_display: boolean
  ack_required: boolean
  event_action: boolean
}

export interface IEventCodeResult {
  EventCode: number
  EventName: string
  EventDesc: string
  EventType: number
  EventLevel: number
  LogSave: number
  LogDisplay: number
  AckRequired: number
  EventAction: number
}

export interface IEventCodeFilters {
  EventCode: string
  EventName: string
  EventType: ISelectOption | null
  EventLevel: ISelectOption | null
  Apply: boolean
}

export interface IEventCodeTableHeaderCheckbox {
  LogSave: boolean
  LogDisplay: boolean
  AckRequired: boolean
  EventAction: boolean
}

export interface IEventCodeRouteQueryParams {
  Page: number
  EventCode: string
  EventName: string
  EventTypeValue: string | undefined
  EventTypeLabel: string | undefined
  EventLevelValue: string | undefined
  EventLevelLabel: string | undefined
}

export interface IEventCodeApiQueryParams extends IApiQueryParamsBase {
  EventCode_icontains?: string
  EventName_icontains?: string
  EventType?: string
  EventLevel?: string
  TableHeaderCheckboxAction?: string
}

export const eventTypesOptions = [
  { value: '0', label: t`System` },
  { value: '1', label: t`Node` },
  { value: '2', label: t`Door` },
  { value: '3', label: t`Region` },
  { value: '4', label: t`Input` },
  { value: '5', label: t`Output` },
  { value: '6', label: t`Elevator` },
  { value: '7', label: t`Relay` },
  { value: '8', label: t`Camera` },
  { value: '9', label: t`Nvr` },
  { value: '10', label: t`Channel` },
  { value: '11', label: t`Gateway` },
  { value: '12', label: t`Lockset` },
  { value: '13', label: t`Facegate` },
  { value: '14', label: t`Subnode` },
  { value: '15', label: t`Reader` },
  { value: '16', label: t`ContGate` },
  { value: '17', label: t`ContLock` },
  { value: '18', label: t`Intercom` },
  { value: '98', label: t`Threat` },
  { value: '99', label: t`Trigger` },
]
// export const eventTypesOptionsObject = optionsToObject(eventTypesOptions)

export const eventLevelsOptions = [
  { value: '0', label: t`Audit` },
  { value: '1', label: t`Notification` },
  { value: '2', label: t`Alert` },
  { value: '3', label: t`Warning` },
]
// export const eventLevelsOptionsObject = optionsToObject(eventLevelsOptions)
