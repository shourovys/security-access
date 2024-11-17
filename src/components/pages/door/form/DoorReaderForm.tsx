import { readerApi, regionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData, doorReaderTypeOption } from '../../../../types/pages/door'
import { IReaderResult } from '../../../../types/pages/reader'
import { IRegionResult } from '../../../../types/pages/region'
import { SERVER_QUERY } from '../../../../utils/config'
import { listIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IDoorFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function DoorReaderForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: regionIsLoading, data: regionData } = useSWR<
    IListServerResponse<IRegionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : regionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: readerIsLoading, data: readerData } = useSWR<
    IListServerResponse<IReaderResult[]>
  >(
    (disabled || typeof handleInputChange === 'undefined') &&
      formData?.SubnodeNo &&
      formData?.SubnodeNo !== '0'
      ? null
      : readerApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )

  return (
    <FormCardWithHeader icon={listIcon} header={t`Reader`}>
      <SwitchButtonSelect
        name="InEnable"
        label={t`Reader In Enable`}
        value={formData?.InEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      {formData?.SubnodeNo === '0' &&
      readerData?.data?.length &&
      formData?.InEnable?.value === '1' ? (
        <Selector
          name="InReader" //InReaderNo
          label={t`OSDP In Reader`}
          value={formData?.InReader}
          onChange={handleInputChange}
          options={readerData?.data.map((result) => ({
            value: result.ReaderNo.toString(),
            label: result.ReaderName,
          }))}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.InReader}
          isLoading={isLoading || readerIsLoading}
        />
      ) : null}

      {formData?.InEnable?.value === '1' && (
        <Selector
          name="InType"
          label={t`Reader In Type`}
          value={formData?.InType}
          onChange={handleInputChange}
          options={doorReaderTypeOption}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.InType}
          isLoading={isLoading}
        />
      )}

      {formData?.InEnable?.value === '1' && (
        <Selector
          name="InRegion"
          label={t`Reader In Region`}
          value={formData?.InRegion}
          onChange={handleInputChange}
          options={regionData?.data.map((result) => ({
            value: result.RegionNo.toString(),
            label: result.RegionName,
          }))}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.InRegion}
          isLoading={isLoading || regionIsLoading}
        />
      )}

      <SwitchButtonSelect
        name="OutEnable"
        label={t`Reader Out Enable`}
        value={formData?.OutEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      {formData?.OutEnable?.value === '1' &&
      formData?.SubnodeNo === '0' &&
      readerData?.data?.length ? (
        <Selector
          name="OutReader"
          label={t`OSDP Out Reader`}
          value={formData?.OutReader}
          onChange={handleInputChange}
          options={readerData?.data.map((result) => ({
            value: result.ReaderNo.toString(),
            label: result.ReaderName,
          }))}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OutReader}
          isLoading={isLoading || readerIsLoading}
        />
      ) : null}

      {formData?.OutEnable?.value === '1' && (
        <Selector
          name="OutType"
          label={t`Reader Out Type`}
          value={formData?.OutType}
          onChange={handleInputChange}
          options={doorReaderTypeOption}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OutType}
          isLoading={isLoading}
        />
      )}
      {formData?.OutEnable?.value === '1' && (
        <Selector
          name="OutRegion"
          label={t`Reader Out Region`}
          value={formData?.OutRegion}
          onChange={handleInputChange}
          options={regionData?.data.map((result) => ({
            value: result.RegionNo.toString(),
            label: result.RegionName,
          }))}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OutRegion}
          isLoading={isLoading || regionIsLoading}
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorReaderForm
