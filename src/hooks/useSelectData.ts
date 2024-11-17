import { actionApi, groupApi } from '../api/urls'
import { ElementsApi } from '../api/urls/common'
import useSWR, { SWRResponse } from 'swr'
import {
  IElementsType,
  IListServerResponse,
  INewElementsResult,
  ISingleServerResponse,
} from '../types/pages/common'
import { IEventElementsResult } from '../types/pages/eventAndAction'
import { IGroupResult, IGroupTypes, groupTypes } from '../types/pages/group'
import { SERVER_QUERY } from '../utils/config'

export function useGroupSelectData(
  disable: boolean,
  type: keyof IGroupTypes
): SWRResponse<IListServerResponse<IGroupResult[]>, Error> {
  if (!(type in groupTypes)) {
    // throw new Error(`Invalid group type: ${type}`)
    // console.log(`Invalid group type: ${type}`)
  }

  const { isLoading, data, error, mutate, isValidating } = useSWR<
    IListServerResponse<IGroupResult[]>
  >(
    disable || !type
      ? null
      : groupApi.list(`${SERVER_QUERY.selectorDataQuery} &GroupType=${groupTypes[type]}`)
  )

  return {
    data,
    error,
    isLoading,
    mutate,
    isValidating,
  }
}

export function useElementSelectData(
  disable: boolean,
  type: IElementsType
): SWRResponse<IListServerResponse<INewElementsResult[]>, Error> {
  const validElementTypes: IElementsType[] = [
    'Node',
    'Door',
    'Region',
    'Input',
    'Output',
    'Elevator',
    'Relay',
    'Camera',
    'Nvr',
    'Channel',
    'Gateway',
    'Lockset',
    'Facegate',
    'Subnode',
    'Reader',
    'ContGate',
    'ContLock',
    'Intercom',
    'Trigger',
    'Threat',
    'Person',
    'Access',
  ]

  if (!validElementTypes.includes(type)) {
    // throw new Error(`Invalid element type: ${type}`)
    // console.log(`Invalid element type: ${type}`)
  }

  const { isLoading, data, error, mutate, isValidating } = useSWR<
    IListServerResponse<INewElementsResult[]>
  >(disable || !type ? null : ElementsApi.list(`${SERVER_QUERY.selectorDataQuery} &type=${type}`))

  return {
    data,
    error,
    isLoading,
    mutate,
    isValidating,
  }
}

export function useActionElementSelectData(
  disable: boolean,
  type?: string | number
): SWRResponse<ISingleServerResponse<IEventElementsResult>, Error> {
  if (!type) {
    // throw new Error(`Invalid element type: ${type}`)
    // console.log(`Invalid element type: ${type}`)
  }

  const { isLoading, data, error, mutate, isValidating } = useSWR<
    ISingleServerResponse<IEventElementsResult>
  >(
    disable || !type
      ? null
      : actionApi.elements(`${SERVER_QUERY.selectorDataQuery}&ActionType=${type}`)
  )

  return {
    data,
    error,
    isLoading,
    mutate,
    isValidating,
  }
}
