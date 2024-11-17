import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPutRequest } from '../../../api/swrConfig'
import { doorRuleApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import DoorRuleFrom from '../../../components/pages/doorrule/form/DoorRuleFrom'
// import DoorRuleOptionsFrom from '../../../components/pages/doorrule/form/DoorRuleOptionsFrom'
import DoorRulePerson1From from '../../../components/pages/doorrule/form/DoorRulePerson1From'
import DoorRulePerson2From from '../../../components/pages/doorrule/form/DoorRulePerson2From'
import DoorRuleRuleDoor from '../../../components/pages/doorrule/form/DoorRuleRuleDoor'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  accessSelectOption,
} from '../../../types/pages/common'
import {
  IDoorRuleFormData,
  IDoorRuleResult,
  doorRuleTypeOption,
} from '../../../types/pages/doorRule'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../../utils/toast'
import t from '../../../utils/translator'
import validateDoorRuleFormData from '../../../utils/validation/doorRule'

// Component to edit a DoorRule
function EditDoorRule() {
  const navigate = useNavigate()
  // Get the doorRule ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IDoorRuleFormData>({
    Partition: null,
    Schedule: null,
    DoorSelect: null,
    DoorIds: [],
    GroupDoorIds: [],
    PersonIds: [],
    PersonIds2: [],
    GroupIds: [],
    GroupIds2: [],
    RuleName: '',
    RuleDesc: '',
    RuleType: null,
    GraceTime: '',
    CardTime: '',
    PersonSelect: null,
    PersonSelect2: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the DoorRule from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IDoorRuleResult>>(
    queryId ? doorRuleApi.details(queryId) : null
  )
  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        Partition,
        Schedule,
        DoorSelect,
        Doors,
        GroupDoors,
        Persons,
        Groups,
        Persons2,
        Groups2,
        RuleName,
        RuleDesc,
        RuleType,
        GraceTime,
        CardTime,
        PersonSelect,
        PersonSelect2,
      } = data.data

      setFormData({
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Schedule: {
          value: Schedule?.ScheduleNo.toString() || 'none',
          // value: Schedule.ScheduleNo.toString(),
          label: Schedule.ScheduleName,
        },
        DoorSelect: findSelectOption(accessSelectOption, DoorSelect),
        DoorIds: Doors?.map((option) => option.DoorNo.toString()) || [],
        GroupDoorIds: GroupDoors?.map((option) => option.GroupNo.toString()) || [],
        PersonIds: Persons?.map((option) => option.PersonNo.toString()) || [],
        PersonIds2: Persons2?.map((option) => option.PersonNo.toString()) || [],
        GroupIds: Groups?.map((option) => option.GroupNo.toString()) || [],
        GroupIds2: Groups2?.map((option) => option.GroupNo.toString()) || [],
        RuleName,
        RuleDesc: RuleDesc || '',
        RuleType: findSelectOption(doorRuleTypeOption, RuleType),
        GraceTime: GraceTime.toString(),
        CardTime: CardTime.toString(),
        PersonSelect: findSelectOption(accessSelectOption, PersonSelect),
        PersonSelect2: findSelectOption(accessSelectOption, PersonSelect2),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(doorRuleApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.doorRuleInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateDoorRuleFormData(formData)

    if (Object.keys(errors).length) {
      setFormErrors(errors)
      //Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value)
      //   }
      // })
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
      link: routeProperty.doorRuleInfo.path(queryId),
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
          isLoading={isLoading}
        />

        <DoorRuleRuleDoor
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
        />

        {/* <DoorRuleOptionsFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
        /> */}

        <DoorRulePerson1From
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
        />

        {formData.RuleType?.label === 'Two Person Rule' && (
          <DoorRulePerson2From
            formData={formData}
            formErrors={formErrors}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
          />
        )}
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.doorRuleInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditDoorRule
