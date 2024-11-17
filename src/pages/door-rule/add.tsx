import { AxiosError } from 'axios'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { doorRuleApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import DoorRuleFrom from '../../components/pages/doorrule/form/DoorRuleFrom'
// import DoorRuleOptionsFrom from '../../components/pages/doorrule/form/DoorRuleOptionsFrom'
import DoorRulePerson1From from '../../components/pages/doorrule/form/DoorRulePerson1From'
import DoorRulePerson2From from '../../components/pages/doorrule/form/DoorRulePerson2From'
import DoorRuleRuleDoor from '../../components/pages/doorrule/form/DoorRuleRuleDoor'
import {
  useDefaultDoorOption,
  useDefaultPartitionOption,
  useDefaultScheduleOption,
} from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  accessSelectOption,
} from '../../types/pages/common'
import { IDoorRuleFormData, doorRuleTypeOption } from '../../types/pages/doorRule'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { addSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'
import validateDoorRuleFormData from '../../utils/validation/doorRule'

// Component to create a DoorRule
function CreateDoorRule() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IDoorRuleFormData>({
    Partition: null,
    Schedule: null,
    DoorSelect: accessSelectOption[0],
    DoorIds: [],
    GroupDoorIds: [],
    PersonIds: [],
    PersonIds2: [],
    GroupIds: [],
    GroupIds2: [],
    RuleName: '',
    RuleDesc: '',
    RuleType: doorRuleTypeOption[0],
    GraceTime: '',
    CardTime: '',
    PersonSelect: accessSelectOption[0],
    PersonSelect2: accessSelectOption[0],
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Set default Partition, Schedule and Door
  useDefaultPartitionOption<IDoorRuleFormData>(setFormData)
  useDefaultScheduleOption<IDoorRuleFormData>(setFormData)
  useDefaultDoorOption<IDoorRuleFormData>(setFormData)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(doorRuleApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to door rule list page on success
      navigate(routeProperty.doorRule.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    const errors = validateDoorRuleFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      PersonIds: formData.PersonIds,
      PersonIds2: formData.PersonIds2,
      GroupIds: formData.GroupIds,
      GroupIds2: formData.GroupIds2,
      PartitionNo: formData.Partition?.value,
      RuleName: formData.RuleName,
      RuleDesc: formData.RuleDesc,
      RuleType: Number(formData.RuleType?.value),
      DoorSelect: formData.DoorSelect?.value,
      DoorIds: formData.DoorIds,
      GroupDoorIds: formData.GroupDoorIds,
      ScheduleNo: formData.Schedule?.value,
      PersonSelect: formData.PersonSelect?.value,
      PersonSelect2: formData.PersonSelect2?.value,
      GraceTime: Number(formData.GraceTime),
      CardTime: Number(formData.CardTime),
    }
    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActionsButtons: IActionsButton[] = [
    {
      color: 'apply',
      icon: applyIcon,
      text: t`Apply`,
      onClick: handleSubmit,
      isLoading: isMutating,
    },
    {
      color: 'cancel',
      icon: cancelIcon,
      text: t`Cancel`,
      link: routeProperty.doorRule.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} sameHeight>
        <DoorRuleFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />

        <DoorRuleRuleDoor
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />

        {/* <DoorRuleOptionsFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        /> */}

        <DoorRulePerson1From
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />

        {formData.RuleType?.value === '3' && (
          <DoorRulePerson2From
            formData={formData}
            formErrors={formErrors}
            handleInputChange={handleInputChange}
          />
        )}
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.doorRule.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateDoorRule
