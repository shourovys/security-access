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

function DeviceListFilterForm({ filterState, handleInputChange }: IProps) {
  const [show, setShow] = useState(false)

  const handleShow = (name: string, checked: boolean) => {
    setShow(checked)
  }

  const filteredDeviceTypeOptions = useLicenseFilter(logDeviceTypeOptions, {
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
  })

  // Fetch elements by type from the server
  const { isLoading: deviceLoading, data: deviceData } = useSWR<
    IListServerResponse<IEventElementsResult>
  >(
    !filterState?.DeviceType?.value
      ? null
      : eventApi.elements(
          `${SERVER_QUERY.selectorDataQuery}&EventType=${filterState?.DeviceType?.value}`
        )
  )

  return (
    <FormCardWithHeader
      icon={listIcon}
      header={t`Device List`}
      twoPart={false}
      selectName="AccessSelect"
      isSelected={show}
      handleSelect={handleShow}
      showChidden={show}
    >
      <Selector
        name="DeviceType"
        placeholder={t`Device Type`}
        value={filterState.DeviceType}
        options={filteredDeviceTypeOptions}
        onChange={handleInputChange}
      />
      <MultiSelect
        name="DeviceIds"
        label={t`Device List`}
        options={deviceData?.data.EventCodes.map((item) => ({
          id: item.EventCode.toString(),
          label: item.EventName,
        }))}
        value={filterState?.DeviceIds}
        onChange={handleInputChange}
        isLoading={deviceLoading}
        gridColSpan2
      />
    </FormCardWithHeader>
  )
}

export default DeviceListFilterForm
