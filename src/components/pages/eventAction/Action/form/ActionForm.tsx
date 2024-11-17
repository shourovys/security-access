import useSWR from 'swr'
import { actionApi } from '../../../../../api/urls'
import Selector, { ISelectOption, TSelectValue } from '../../../../../components/atomic/Selector'
import Textarea from '../../../../../components/atomic/Textarea'
import MultiSelect from '../../../../../components/common/form/MultiSelect'
import FormCardWithHeader from '../../../../../components/HOC/FormCardWithHeader'
import FormCardInputTwoPart from '../../../../../components/HOC/style/form/FormCardInputTwoPart'
import useLicenseFilter from '../../../../../hooks/useLicenseFilter'
import { THandleInputChange } from '../../../../../types/components/common'
import { IListServerResponse, INewFormErrors } from '../../../../../types/pages/common'
import {
  actionTypesOptions,
  IActionFormData,
  IEventElementsResult,
} from '../../../../../types/pages/eventAndAction'
import { SERVER_QUERY } from '../../../../../utils/config'
import { actionIcon } from '../../../../../utils/icons'
import t from '../../../../../utils/translator'

interface IProps {
  formData?: IActionFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IActionFormData>
  disabled?: boolean
  isLoading?: boolean
}

function ActionForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  // Fetch elements by type from the server
  const { isLoading: elementsLoading, data: elementsData } = useSWR<
    IListServerResponse<IEventElementsResult>
  >(
    disabled || typeof handleInputChange === 'undefined' || !formData?.ActionType?.value
      ? null
      : actionApi.elements(
          `${SERVER_QUERY.selectorDataQuery}&ActionType=${formData?.ActionType?.value}`
        )
  )

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('ActionItemIds', [])
    }
  }
  const filteredActionTypesOptions = useLicenseFilter<ISelectOption>(actionTypesOptions, {
    '10': 'Camera',
    '11': 'Channel',
    '12': 'Lockset',
    '13': 'Facegate',
    '15': 'ContLock',
    '16': 'Intercom',
  })

  return (
    <FormCardWithHeader icon={actionIcon} header={t`Action`} twoPart={false}>
      <FormCardInputTwoPart>
        <Selector
          name="ActionType"
          label={t`Action Type`}
          options={filteredActionTypesOptions}
          value={formData?.ActionType}
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ActionType}
          isLoading={isLoading}
        />

        <Selector
          name="ActionCtrl"
          label={t`Action Control`}
          options={elementsData?.data?.ActionControls.map((item) => ({
            value: item.value.toString(),
            label: item.text,
          }))}
          value={formData?.ActionCtrl}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ActionCtrl}
          isLoading={isLoading || elementsLoading}
        />
        <div />

        {formData?.ActionType?.value !== '11' ? (
          !(disabled || typeof handleInputChange === 'undefined') ? (
            <MultiSelect
              name="ActionItemIds"
              label={t`Action Item`}
              options={elementsData?.data?.ActionItems.map((item) => ({
                id: item.No.toString(),
                label: item.Name,
              }))}
              value={formData?.ActionItemIds}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.ActionItemIds}
              isLoading={isLoading || elementsLoading}
              gridColSpan2
            />
          ) : (
            <Textarea
              name="ActionItemNames"
              label={t`Action Item`}
              value={formData?.ActionItemNames}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading}
            />
          )
        ) : null}
      </FormCardInputTwoPart>
    </FormCardWithHeader>
  )
}

export default ActionForm
