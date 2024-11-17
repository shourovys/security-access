import { useState } from 'react'
import useSWR from 'swr'
import { eventApi } from '../../../api/urls'
import useLicenseFilter from '../../../hooks/useLicenseFilter'
import { THandleFilterInputChange } from '../../../types/components/common'
import { ISmartReportFilters } from '../../../types/pages/SmartReport'
import { IListServerResponse } from '../../../types/pages/common'
import { IEventElementsResult } from '../../../types/pages/eventAndAction'
import { logDeviceTypeOptions } from '../../../types/pages/log'
import { SERVER_QUERY } from '../../../utils/config'
import { listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import FormCardWithHeader from '../../HOC/FormCardWithHeader'
import Selector from '../../atomic/Selector'
import MultiSelect from '../../common/form/MultiSelect'

interface IProps {
  filterState: ISmartReportFilters
  handleInputChange: THandleFilterInputChange
}

function EventListFilterForm({ filterState, handleInputChange }: IProps) {
  const [show, setShow] = useState(false)

  const handleShow = (name: string, checked: boolean) => {
    setShow(checked)
  }

  const filteredEventTypeOptions = useLicenseFilter(
    [{ value: '0', label: t`System` }, ...logDeviceTypeOptions],
    {
      '8': 'Camera',
      '9': 'Channel',
      '10': 'Channel',
      '11': 'Lockset',
      '12': 'Lockset',
      '13': 'Facegate',
      '14': 'Subnode',
      '15': 'Subnode',
      '16': 'ContLock',
      '17': 'ContLock',
      '18': 'Intercom',
    }
  )

  // Fetch elements by type from the server
  const { isLoading: eventLoading, data: eventData } = useSWR<
    IListServerResponse<IEventElementsResult>
  >(
    !filterState?.EventType?.value
      ? null
      : eventApi.elements(
          `${SERVER_QUERY.selectorDataQuery}&EventType=${filterState?.EventType?.value}`
        )
  )

  return (
    <FormCardWithHeader
      icon={listIcon}
      header={t`Event List`}
      twoPart={false}
      selectName="AccessSelect"
      isSelected={show}
      handleSelect={handleShow}
      showChidden={show}
    >
      <Selector
        name="EventType"
        placeholder={t`Event Type`}
        value={filterState.EventType}
        options={filteredEventTypeOptions}
        onChange={handleInputChange}
      />
      <MultiSelect
        name="EventCodes"
        label={t`Event List`}
        options={eventData?.data.EventCodes.map((item) => ({
          id: item.EventCode.toString(),
          label: item.EventName,
        }))}
        value={filterState?.EventCodes}
        onChange={handleInputChange}
        isLoading={eventLoading}
        gridColSpan2
      />
    </FormCardWithHeader>
  )
}

export default EventListFilterForm
