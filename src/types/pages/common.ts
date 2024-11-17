import optionsToObject from '../../utils/optionsToObject'
import t from '../../utils/translator'

// common api response
export interface IListServerResponse<T> {
  count: number
  next: string | null
  previous: string | null
  data: T
}

export interface ICommandResponse<T> {
  cgi: {
    success: boolean
    errors: string | null
    data: T
  }
}

export interface ICommandArrayResponse<T> {
  cgi: {
    success: boolean
    errors: string | null
    data: T[]
  }
}

interface CommandResponseStructure {
  data?: string
  success: boolean
  errors?: string
  id?: number | string
}

export interface IServerCommandResponse<T> {
  success: boolean
  data: T
  cgi: CommandResponseStructure
}

export interface ISingleServerResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface IServerErrorResponse {
  errors?:
    | {
        [key: string]: string | string[]
      }
    | string
  success: boolean
  message: string
  data?: any
  cgi?: CommandResponseStructure | CommandResponseStructure[]
}

export interface IServerCommandErrorResponse {
  cgi: CommandResponseStructure | CommandResponseStructure[]
}

export interface IFormErrors {
  [key: string]: string | undefined | null
}

export type INewFormErrors<T> = Partial<Record<keyof T, string>> & { non_field_errors?: string }

export type ISelectedInputFields<T> = Partial<Record<keyof T, boolean>>

export interface IApiQueryParamsBase {
  offset: number
  limit: number
  sort_by: string
  order: 'asc' | 'desc'
}

export type IApiQueryParamsBaseWithOutLimit = Pick<IApiQueryParamsBase, 'sort_by' | 'order'>

export interface IElementsResult {
  id: number
  name: string
}

export interface INewElementsResult {
  No: number
  Name: string
}

export interface ITaskItemsResult {
  ItemNo: number
  ItemName: string
}

export interface ISystemSuccessResult {
  success: boolean
  message: string
}

export type IElementsType =
  | 'Node'
  | 'Door'
  | 'Region'
  | 'Input'
  | 'Output'
  | 'Elevator'
  | 'Relay'
  | 'Camera'
  | 'Nvr'
  | 'Channel'
  | 'Gateway'
  | 'Lockset'
  | 'Facegate'
  | 'Subnode'
  | 'Reader'
  | 'ContGate'
  | 'ContLock'
  | 'Intercom'
  | 'Trigger'
  | 'Threat'
  | 'Person'
  | 'Access'

export type IBooleanSelectOptions = [
  {
    label: `No`
    value: '0'
  },
  {
    label: 'Yes'
    value: '1'
  },
]

export const booleanSelectOption: IBooleanSelectOptions = [
  {
    label: 'No',
    value: '0',
  },
  {
    label: 'Yes',
    value: '1',
  },
]
export const booleanSelectObject = optionsToObject(booleanSelectOption)

export const activeSelectOption = [
  {
    label: t`Inactive`,
    value: '0',
  },
  {
    label: t`Active`,
    value: '1',
  },
]

export const activeSelectObject = optionsToObject(activeSelectOption)

export const lockSelectOption = [
  {
    label: t`Locked`,
    value: '0',
  },
  {
    label: t`Unlocked`,
    value: '1',
  },
]

export const lockSelectObject = optionsToObject(lockSelectOption)

export const accessSelectOption = [
  {
    label: t`Individual`,
    value: '0',
  },
  {
    label: t`Group`,
    value: '1',
  },
]

export interface IFwUpdateResult {
  Description: string
  DeviceType: string
  ExtendedVersion: string
  IsPublic: boolean
  Links: {
    Href: string
    Rel: string
  }[]
  Name: string
  ReleaseDate: string
  Version: string
}
