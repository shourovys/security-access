import { sendPostRequest } from '../../../api/swrConfig'
import { eventCodeApi } from '../../../api/urls'
import TableData from '../../../components/HOC/style/table/TableData'
import TableRow from '../../../components/HOC/style/table/TableRow'
import { useEffect, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import {
  eventLevelsOptions,
  eventTypesOptions,
  IEventCodeResult,
  IEventCodeTableHeaderCheckbox,
} from '../../../types/pages/eventCode'
import { editSuccessfulToast } from '../../../utils/toast'
import Checkbox from '../../atomic/Checkbox'
import t from '../../../utils/translator'
import useAuth from '../../../hooks/useAuth'
import useLicenseFilter from '../../../hooks/useLicenseFilter'

type IProps = {
  row: IEventCodeResult
  selected: string[]
}

function EventCodeTableRow({ row, selected }: IProps) {
  const { has_license } = useAuth()
  // state for storing server value of checkboxes
  const [checkboxValue, setCheckboxValue] = useState<IEventCodeTableHeaderCheckbox>({
    LogSave: row.LogSave === 1,
    LogDisplay: row.LogDisplay === 1,
    AckRequired: row.AckRequired === 1,
    EventAction: row.EventAction === 1,
  })

  useEffect(() => {
    if (row) {
      setCheckboxValue({
        LogSave: row.LogSave === 1,
        LogDisplay: row.LogDisplay === 1,
        AckRequired: row.AckRequired === 1,
        EventAction: row.EventAction === 1,
      })
    }
  }, [row])

  // Define the mutation function for checkbox action
  const { trigger: enableDisableTrigger } = useSWRMutation(
    eventCodeApi.enableDisable,
    sendPostRequest,
    {
      onSuccess: () => {
        editSuccessfulToast()
      },
    }
  )

  const handleTableRowCheckboxAction = (
    name: keyof IEventCodeTableHeaderCheckbox,
    value: boolean
  ) => {
    enableDisableTrigger({
      Column: name,
      IsActive: value,
      EventCodes: [row.EventCode],
    })
    setCheckboxValue((prevState) => ({ ...prevState, [name]: value }))
  }

  // arr to key value pair
  const eventTypeOptionsLevel = useLicenseFilter(eventTypesOptions, {
    '8': 'Camera',
    '9': 'Channel',
    '10': 'Channel',
    '11': 'Lockset',
    '12': 'Lockset',
    '13': 'Facegate',
    '18': 'Intercom',
  }).reduce(
    (
      acc: {
        [key: string]: string
      },
      curr
    ) => {
      acc[curr.value] = curr.label
      return acc
    },
    {}
  )

  const eventLevelOptionsLevel = eventLevelsOptions.reduce(
    (acc: { [key: string]: string }, curr) => {
      acc[curr.value] = curr.label
      return acc
    },
    {}
  )

  return (
    <TableRow key={row.EventCode} selected={selected.indexOf(row.EventCode.toString()) !== -1}>
      <TableData>{row.EventCode}</TableData>
      <TableData>{t(row.EventName)}</TableData>
      {/*only this is translated of db data*/}
      <TableData>{row.EventDesc}</TableData>
      <TableData>{eventTypeOptionsLevel[row.EventType]}</TableData>
      <TableData>{eventLevelOptionsLevel[row.EventLevel]}</TableData>
      <TableData>
        <div className="flex items-center justify-center">
          <Checkbox
            value={`log_save-${row.EventCode}`}
            checked={checkboxValue.LogSave}
            onChange={(checked) => {
              handleTableRowCheckboxAction('LogSave', checked)
            }}
          />
        </div>
      </TableData>
      <TableData>
        <div className="flex items-center justify-center">
          <Checkbox
            value={`log_display-${row.EventCode}`}
            checked={checkboxValue.LogDisplay}
            onChange={(checked) => {
              handleTableRowCheckboxAction('LogDisplay', checked)
            }}
          />
        </div>
      </TableData>
      <TableData>
        <div className="flex items-center justify-center">
          <Checkbox
            value={`ack_required-${row.EventCode}`}
            checked={checkboxValue.AckRequired}
            onChange={(checked) => {
              handleTableRowCheckboxAction('AckRequired', checked)
            }}
          />
        </div>
      </TableData>
      <TableData>
        <div className="flex items-center justify-center">
          <Checkbox
            value={`event_action-${row.EventCode}`}
            checked={checkboxValue.EventAction}
            onChange={(checked) => {
              handleTableRowCheckboxAction('EventAction', checked)
            }}
          />
        </div>
      </TableData>
    </TableRow>
  )
}

export default EventCodeTableRow
