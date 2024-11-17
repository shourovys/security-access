import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { doorRuleApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import DoorRuleFrom from '../../../components/pages/doorrule/form/DoorRuleFrom'
// import DoorRuleOptionsFrom from '../../../components/pages/doorrule/form/DoorRuleOptionsFrom'
import DoorRulePerson1From from '../../../components/pages/doorrule/form/DoorRulePerson1From'
import DoorRulePerson2From from '../../../components/pages/doorrule/form/DoorRulePerson2From'
import DoorRuleRuleDoor from '../../../components/pages/doorrule/form/DoorRuleRuleDoor'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse, accessSelectOption } from '../../../types/pages/common'
import {
  IDoorRuleInfoFormData,
  IDoorRuleResult,
  doorRuleTypeOption,
} from '../../../types/pages/doorRule'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a doorRule
function DoorRuleInfo() {
  const navigate = useNavigate()
  // Get the doorRule ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IDoorRuleInfoFormData>({
    Partition: null,
    Schedule: null,
    DoorSelect: null,
    DoorIds: [],
    GroupDoorIds: [],
    Doors: null,
    GroupDoors: null,
    PersonIds: [],
    PersonIds2: [],
    GroupIds: [],
    GroupIds2: [],
    Persons: null,
    Persons2: null,
    Groups: null,
    Groups2: null,
    RuleName: '',
    RuleDesc: '',
    RuleType: null,
    GraceTime: '',
    CardTime: '',
    PersonSelect: null,
    PersonSelect2: null,
  })

  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the doorRule from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IDoorRuleResult>>(
    isDeleted || !queryId ? null : doorRuleApi.details(queryId)
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
          value: Schedule.ScheduleNo.toString(),
          label: Schedule.ScheduleName,
        },
        DoorSelect: findSelectOption(accessSelectOption, DoorSelect),
        DoorIds: Doors?.map((option) => option.DoorNo.toString()) || [],
        GroupDoorIds: GroupDoors?.map((option) => option.GroupNo.toString()) || [],
        Doors,
        GroupDoors,
        PersonIds: Persons?.map((option) => option.PersonNo.toString()) || [],
        PersonIds2: Persons2?.map((option) => option.PersonNo.toString()) || [],
        GroupIds: Groups?.map((option) => option.GroupNo.toString()) || [],
        GroupIds2: Groups2?.map((option) => option.GroupNo.toString()) || [],
        Persons,
        Persons2,
        Groups,
        Groups2,
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

  // Define the mutation function to delete the doorRule from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    doorRuleApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to doorRule list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.doorRule.path(), { replace: true })
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeleted(false)
      },
    }
  )
  // Define the function to call delete mutation with Alert Dialog
  const handleDelete = () => {
    const deleteMutation = () => {
      setIsDeleted(true)
      return deleteTrigger()
    }
    openAlertDialogWithPromise(deleteMutation, { success: t`Success` }, t`Do you want to Delete ?`)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.doorRuleEdit.path(queryId),
    },
    {
      color: 'danger',
      icon: deleteIcon,
      text: t`Delete`,
      onClick: handleDelete,
      isLoading: deleteIsLoading,
    },
    {
      color: 'danger',
      icon: listIcon,
      text: t`List`,
      link: routeProperty.doorRule.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer sameHeight>
        <DoorRuleFrom formData={formData} isLoading={isLoading} />

        <DoorRuleRuleDoor formData={formData} isLoading={isLoading} />

        {/* <DoorRuleOptionsFrom formData={formData} isLoading={isLoading} /> */}

        <DoorRulePerson1From formData={formData} isLoading={isLoading} />

        {formData.RuleType?.label === 'Two Person Rule' && (
          <DoorRulePerson2From formData={formData} isLoading={isLoading} />
        )}
      </FormContainer>
    </Page>
  )
}

export default DoorRuleInfo
