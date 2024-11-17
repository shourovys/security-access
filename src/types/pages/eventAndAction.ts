import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import t from '../../utils/translator'
import { INewElementsResult } from './common'

export interface IEventResult {
  EventNo: number // Event No (Primary Key)
  EventWhats: {
    EventCodes: IEventActionEventCodeResult
  }[]
  EventItems: {
    Items: {
      No: number
      Name: string
    }
  }[]
  EventActionNo: number
  EventType?: number // 0: System, 1: Node, 2: Door, ...
}

export interface IEventActionEventCodeResult {
  EventCode: number
  EventName: string
}

export interface IEventElementsResult {
  EventCodes: IEventActionEventCodeResult[]
  EventItems: INewElementsResult[]
}

export interface IEventFormData {
  EventType: ISelectOption | null
  EventCodes: string[]
  EventNames?: string
  EventItemIds: string[] | any
  EventItemNames?: string
}

export const eventActionEventTypesOptions = [
  { value: '0', label: t('System') },
  { value: '1', label: t('Node') },
  { value: '2', label: t('Door') },
  { value: '3', label: t`Region` },
  { value: '4', label: t('Input') },
  { value: '5', label: t`Output` },
  { value: '6', label: t`Elevator` },
  { value: '7', label: t`Relay` },
  { value: '8', label: t`Camera` },
  { value: '9', label: t`Nvr` },
  { value: '10', label: t`Channel` },
  { value: '11', label: t('Gateway') },
  { value: '12', label: t('Lockset') },
  { value: '13', label: t('Facegate') },
  { value: '14', label: t('Subnode') },
  { value: '15', label: t('Reader') },
  { value: '16', label: t`ContGate` },
  { value: '17', label: t`ContLock` },
  { value: '18', label: t('Intercom') },
  { value: '98', label: t`Trigger` },
  { value: '99', label: t('Threat') },
  // { value: '100', label: t`Person` },
  { value: '101', label: t`Person` },
]

export const eventActionEventTypesObject = optionsToObject(eventActionEventTypesOptions)

export interface IActionResult {
  ActionNo: number
  Items:
    | [
        {
          ItemNo: number
          ItemName: string
        },
      ]
    | null
  EventActionNo: number
  ActionType: number
  ActionCtrl: number
}

export interface IActionActionActionCodeResult {
  ActionCode: number
  ActionName: string
}

// export interface IActionElementsResult {
//     ActionCodes: IActionActionActionCodeResult[]
//     ActionItems: INewElementsResult[]
// }

export interface IActionFormData {
  ActionType: ISelectOption | null
  ActionCtrl: ISelectOption | null
  ActionItemIds: string[]
  ActionItemNames?: string
}

export interface IEventElements {
  value: number
  text: string
}

export interface IEventElementsResult {
  ActionControls: IEventElements[]
  ActionItems: INewElementsResult[]
}

export const actionTypesOptions = [
  { value: '2', label: t`Door` },
  { value: '4', label: t('Lock') },
  { value: '7', label: t`Output` },
  { value: '8', label: t`Elevator` },
  { value: '9', label: t`Relay` },
  { value: '10', label: t`Record` },
  { value: '11', label: t`Tagging` },
  { value: '12', label: t`Lockset` },
  { value: '13', label: t`Facegate` },
  { value: '15', label: t`ContLock` },
  { value: '16', label: t`Intercom` },
  { value: '99', label: t`Threat` },
  { value: '100', label: t('Notification') },
]

export const actionTypesObject = optionsToObject(actionTypesOptions)

// export interface IActionControlOptions {
//   [key: string]: ISelectOption[]
// }
