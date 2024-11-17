import useSWR from 'swr'
import { eventApi } from '../../../../../api/urls'
import FormCardWithHeader from '../../../../../components/HOC/FormCardWithHeader'
import FormCardInputTwoPart from '../../../../../components/HOC/style/form/FormCardInputTwoPart'
import Selector, { ISelectOption, TSelectValue } from '../../../../../components/atomic/Selector'
import Textarea from '../../../../../components/atomic/Textarea'
import MultiSelect from '../../../../../components/common/form/MultiSelect'
import useLicenseFilter from '../../../../../hooks/useLicenseFilter'
import { THandleInputChange } from '../../../../../types/components/common'
import { IListServerResponse, INewFormErrors } from '../../../../../types/pages/common'
import {
  IEventElementsResult,
  IEventFormData,
  eventActionEventTypesOptions,
} from '../../../../../types/pages/eventAndAction'
import { SERVER_QUERY } from '../../../../../utils/config'
import { eventIcon } from '../../../../../utils/icons'
import t from '../../../../../utils/translator'

interface IProps {
  formData?: IEventFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IEventFormData>
  disabled?: boolean
  isLoading?: boolean
}

function EventForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  // Fetch elements by type from the server
  const { isLoading: elementsLoading, data: elementsData } = useSWR<
    IListServerResponse<IEventElementsResult>
  >(
    disabled || typeof handleInputChange === 'undefined' || !formData?.EventType?.value
      ? null
      : eventApi.elements(
          `${SERVER_QUERY.selectorDataQuery}&EventType=${formData?.EventType?.value}`
        )
  )

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('EventCodes', [])
      handleInputChange('EventItemIds', [])
    }
  }

  const filteredEventTypesOptions = useLicenseFilter<ISelectOption>(eventActionEventTypesOptions, {
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

  return (
    <FormCardWithHeader icon={eventIcon} header={t`Event`} twoPart={false}>
      <FormCardInputTwoPart>
        <Selector
          name="EventType"
          label={t`Event Type`}
          options={filteredEventTypesOptions}
          value={formData?.EventType}
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.EventType}
          isLoading={isLoading}
        />
      </FormCardInputTwoPart>
      <FormCardInputTwoPart>
        {formData?.EventType?.value !== '101' ? (
          !(disabled || typeof handleInputChange === 'undefined') ? (
            <MultiSelect
              name="EventCodes"
              label={t`Event Codes`}
              options={elementsData?.data.EventCodes.map((item) => ({
                id: item.EventCode.toString(),
                label: item.EventName,
              }))}
              value={formData?.EventCodes}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.EventCodes}
              isLoading={isLoading || elementsLoading}
              gridColSpan2
            />
          ) : (
            <Textarea
              name="EventNames"
              label={t`Event Codes`}
              value={formData?.EventNames}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading}
            />
          )
        ) : null}
      </FormCardInputTwoPart>

      <FormCardInputTwoPart>
        {formData?.EventType?.value !== '0' &&
          (!(disabled || typeof handleInputChange === 'undefined') ? (
            <MultiSelect
              name="EventItemIds"
              label={t`Event Item`}
              options={elementsData?.data.EventItems.map((item) => ({
                id: item.No.toString(),
                label: item.Name,
              }))}
              value={formData?.EventItemIds}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.EventItemIds}
              isLoading={isLoading || elementsLoading}
              gridColSpan2
            />
          ) : (
            <Textarea
              name="EventItemNames"
              label={t`Event Items`}
              value={formData?.EventItemNames}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading}
            />
          ))}
      </FormCardInputTwoPart>
    </FormCardWithHeader>
  )
}

export default EventForm
