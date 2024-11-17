import {
  actionApi,
  channelApi,
  contGateApi,
  definedFieldApi,
  doorApi,
  elevatorApi,
  floorApi,
  formatApi,
  gatewayApi,
  holidayApi,
  nodeApi,
  nvrApi,
  partitionApi,
  scheduleApi,
  threatApi,
  timeApi,
  userRoleApi,
} from '../api/urls'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import { IChannelResult } from '../types/pages/channel'
import { IListServerResponse, ISingleServerResponse } from '../types/pages/common'
import { IContGateResult } from '../types/pages/contGate'
import { IDefinedFieldResult } from '../types/pages/definedField'
import { IDoorResult } from '../types/pages/door'
import { IElevatorResult } from '../types/pages/elevator'
import { IEventElementsResult } from '../types/pages/eventAndAction'
import { IFloorResult } from '../types/pages/floor'
import { IFormatResult } from '../types/pages/format'
import { IGatewayResult } from '../types/pages/gateway'
import { IHolidayResult } from '../types/pages/holiday'
import { INodeResult } from '../types/pages/node'
import { INvrResult } from '../types/pages/nvr'
import { IPartitionResult } from '../types/pages/partition'
import { IScheduleResult } from '../types/pages/schedule'
import { IThreatResult } from '../types/pages/threat'
import { IUserRoleResult } from '../types/pages/userRole'
import { SERVER_QUERY } from '../utils/config'

export function useDefaultPartitionOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: partitionData } = useSWR<IListServerResponse<IPartitionResult[]>>(
    partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (partitionData && partitionData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Partition']: {
          label: partitionData.data[0].PartitionName,
          value: partitionData.data[0].PartitionNo.toString(),
        },
      }))
    }
  }, [partitionData, setState])
}

export function useDefaultChannelOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: channelData } = useSWR<IListServerResponse<IChannelResult[]>>(
    channelApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (channelData && channelData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Channel']: {
          label: channelData.data[0].ChannelName,
          value: channelData.data[0].ChannelId.toString(),
        },
      }))
    }
  }, [channelData, setState])
}

export function useDefaultFloorOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: floorData } = useSWR<IListServerResponse<IFloorResult[]>>(
    floorApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (floorData && floorData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Floor']: {
          label: floorData.data[0].FloorName,
          value: floorData.data[0].FloorNo.toString(),
        },
      }))
    }
  }, [floorData, setState])
}

export function useDefaultNvrOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: nvrData } = useSWR<IListServerResponse<INvrResult[]>>(
    nvrApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (nvrData && nvrData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Nvr']: {
          label: nvrData.data[0].NvrName,
          value: nvrData.data[0].NvrNo.toString(),
        },
      }))
    }
  }, [nvrData, setState])
}

export function useDefaultGatewayOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: gatewayData } = useSWR<IListServerResponse<IGatewayResult[]>>(
    gatewayApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (gatewayData && gatewayData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Gateway']: {
          label: gatewayData.data[0].GatewayName,
          value: gatewayData.data[0].GatewayNo.toString(),
        },
      }))
    }
  }, [gatewayData, setState])
}

export function useDefaultNodeOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
    nodeApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (nodeData && nodeData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Node']: {
          label: nodeData.data[0].NodeName,
          value: nodeData.data[0].NodeNo.toString(),
        },
      }))
    }
  }, [nodeData, setState])
}

export function useDefaultThreatOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: threatData } = useSWR<IListServerResponse<IThreatResult[]>>(
    threatApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (threatData && threatData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Threat']: {
          label: threatData.data[0].ThreatName,
          value: threatData.data[0].ThreatNo.toString(),
        },
      }))
    }
  }, [threatData, setState])
}

export function useDefaultElevatorOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: elevatorData } = useSWR<IListServerResponse<IElevatorResult[]>>(
    elevatorApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (elevatorData && elevatorData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Elevator']: {
          label: elevatorData.data[0].ElevatorName,
          value: elevatorData.data[0].ElevatorNo.toString(),
        },
      }))
    }
  }, [elevatorData, setState])
}
//
// export function useDefaultHolidayOption<T>(
//   setState: React.Dispatch<React.SetStateAction<T>>,
//   keyName?: keyof T
// ) {
//   const { data: holidayData } = useSWR<IListServerResponse<IHolidayResult[]>>(
//     holidayApi.list(SERVER_QUERY.selectorDataQuery)
//   )
//
//   useEffect(() => {
//     if (holidayData && holidayData.data.length > 0) {
//       setState((prevState) => ({
//         ...prevState,
//         [keyName || 'Holiday']: {
//           label: holidayData.data[0].HolidayName,
//           value: holidayData.data[0].HolidayNo.toString(),
//         },
//       }))
//     }
//   }, [holidayData, setState])
// }

export function useDefaultScheduleOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: scheduleData } = useSWR<IListServerResponse<IScheduleResult[]>>(
    scheduleApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (scheduleData && scheduleData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Schedule']: {
          label: scheduleData.data[0].ScheduleName,
          value: scheduleData.data[0].ScheduleNo.toString(),
        },
      }))
    }
  }, [scheduleData, setState])
}

export function useDefaultDoorOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: doorData } = useSWR<IListServerResponse<IDoorResult[]>>(
    doorApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (doorData && doorData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Door']: {
          label: doorData.data[0].DoorName,
          value: doorData.data[0].DoorNo.toString(),
        },
      }))
    }
  }, [doorData, setState])
}

export function useDefaultUserRoleOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  query?: string,
  keyName?: keyof T
) {
  const { data: userRoleData } = useSWR<IListServerResponse<IUserRoleResult[]>>(
    userRoleApi.list(query ? query : SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (userRoleData && userRoleData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Role']: {
          label: userRoleData.data[0].RoleName,
          value: userRoleData.data[0].RoleNo.toString(),
        },
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Role']: null,
      }))
    }
  }, [userRoleData, setState])
}

export function useDefaultFormatOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: formatData } = useSWR<IListServerResponse<IFormatResult[]>>(
    formatApi.list(`${SERVER_QUERY.selectorDataQuery}&DefaultFormat=${1}`)
  )

  useEffect(() => {
    if (formatData && formatData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Format']: {
          label: formatData.data[0].FormatName,
          value: formatData.data[0].FormatNo.toString(),
        },
      }))
    }
  }, [formatData, setState])
}

export function useDefaultActionElement<T>(
  actionTypeId: string | number | undefined,
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: formatData } = useSWR<ISingleServerResponse<IEventElementsResult>>(
    actionApi.elements(`${SERVER_QUERY.selectorDataQuery}&ActionType=${actionTypeId}`)
  )

  useEffect(() => {
    if (formatData && formatData.data.ActionControls.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'ActionCtrl']: {
          label: formatData.data.ActionControls[0].text,
          value: formatData.data.ActionControls[0].value.toString(),
        },
      }))
    }
  }, [formatData, setState])
}

export function useDefaultTimezoneOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: timezoneData } = useSWR<IListServerResponse<string[]>>(timeApi.timezone)

  useEffect(() => {
    if (timezoneData && timezoneData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'Timezone']: {
          label: timezoneData.data[0],
          value: timezoneData.data[0],
        },
      }))
    }
  }, [timezoneData, setState])
}

export function useDefaultContGateOption<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T
) {
  const { data: contGateData } = useSWR<IListServerResponse<IContGateResult[]>>(
    contGateApi.list(SERVER_QUERY.selectorDataQuery)
  )

  useEffect(() => {
    if (contGateData && contGateData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'ContGate']: {
          label: contGateData.data[0].ContGateName,
          value: contGateData.data[0].ContGateNo.toString(),
        },
      }))
    }
  }, [contGateData, setState])
}

export function useDefaultDefinedFieldNo<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  keyName?: keyof T,
  definedFieldNo?: string
) {
  const { data: definedFieldData } = useSWR<IListServerResponse<IDefinedFieldResult[]>>(
    definedFieldApi.list(SERVER_QUERY.selectorDataQuery + '&sort_by=FieldNo&order=desc')
  )

  useEffect(() => {
    if (definedFieldData && definedFieldData.data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        [keyName || 'FieldNo']: definedFieldData?.data[0].FieldNo + 1 || 1,
      }))
    }
  }, [definedFieldData, setState, definedFieldNo])
}
