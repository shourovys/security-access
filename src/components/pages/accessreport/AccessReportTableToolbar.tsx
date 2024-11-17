import useSWR from 'swr'
import { readerApi, regionApi } from '../../../api/urls'
import DateInput from '../../../components/atomic/DateInput'
import Selector from '../../../components/atomic/Selector'
import { THandleDateChange, THandleFilterInputChange } from '../../../types/components/common'
import {
  IAccessReportFilters,
  accessReportDeviceTypeOptions,
} from '../../../types/pages/accessReport'
import { IListServerResponse } from '../../../types/pages/common'
import { IReaderResult } from '../../../types/pages/reader'
import { IRegionResult } from '../../../types/pages/region'
import { SERVER_QUERY } from '../../../utils/config'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'

interface IProps {
  filterState: IAccessReportFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function AccessReportTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const handleDateChange: THandleDateChange = (name, value) => {
    if (handleInputChange) {
      handleInputChange(name, value?.startDate)
    }
  }

  const { isLoading: readerIsLoading, data: readerData } = useSWR<
    IListServerResponse<IReaderResult[]>
  >(readerApi.list(SERVER_QUERY.selectorDataQuery))

  const { isLoading: regionIsLoading, data: regionData } = useSWR<
    IListServerResponse<IRegionResult[]>
  >(regionApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <DateInput
          name="EventTime"
          placeholder={t`Event Time`}
          value={{
            startDate: filterState.EventTime ? filterState.EventTime : null,
            endDate: filterState.EventTime ? filterState.EventTime : null,
          }}
          onChange={handleDateChange}
        />

        <Input
          name="EventName"
          placeholder={t`Event Name`}
          value={filterState.EventName}
          onChange={handleInputChange}
        />

        <Input
          name="Person"
          type="number"
          placeholder={t`Person No`}
          value={filterState.Person}
          onChange={handleInputChange}
        />

        <Input
          name="PersonName"
          placeholder={t`Person Name`}
          value={filterState.PersonName}
          onChange={handleInputChange}
        />

        <Input
          name="CredentialNumber"
          type="number"
          placeholder={t`Credential Number`}
          value={filterState.CredentialNumber}
          onChange={handleInputChange}
        />

        <Selector
          name="DeviceType"
          placeholder={t`Device Type`}
          value={filterState.DeviceType}
          options={accessReportDeviceTypeOptions}
          isClearable
          onChange={handleInputChange}
        />

        <Input
          name="DeviceNo"
          placeholder={t`Device No`}
          value={filterState.DeviceNo}
          onChange={handleInputChange}
        />

        <Input
          name="DeviceName"
          placeholder={t`Device Name`}
          value={filterState.DeviceName}
          onChange={handleInputChange}
        />

        <Selector
          name="Reader"
          placeholder={t`Reader`}
          value={filterState.Reader}
          options={readerData?.data.map((result) => ({
            value: result.ReaderNo.toString(),
            label: result.ReaderName,
          }))}
          isClearable
          onChange={handleInputChange}
          isLoading={readerIsLoading}
        />

        <Selector
          name="Region"
          placeholder={t`Region`}
          value={filterState.Region}
          options={regionData?.data.map((result) => ({
            value: result.RegionNo.toString(),
            label: result.RegionName,
          }))}
          isClearable
          onChange={handleInputChange}
          isLoading={regionIsLoading}
        />
      </div>

      <div className="flex gap-3.5 lg:gap-4">
        <Button onClick={handleFilterApply}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button color="cancel" onClick={handleFilterStateReset}>
          <Icon icon={resetIcon} />
          <span>{t`Reset`}</span>
        </Button>
      </div>
    </TableToolbarContainer>
  )
}

export default AccessReportTableToolbar
