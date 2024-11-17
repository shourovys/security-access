import { sendPutRequest } from '../../../api/swrConfig'
import { groupApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../types/pages/common'
import { IGroupFormData, IGroupResult, groupTypesOptions } from '../../../types/pages/group'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import validateGroupFormData from '../../../utils/validation/group'
import GroupForm from '../../../components/pages/group/form/GroupForm'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'
import useLicenseFilter from '../../../hooks/useLicenseFilter'
import { ISelectOption } from '../../../components/atomic/Selector'

// Component to edit a Group
function EditGroup() {
  const navigate = useNavigate()
  // Get the group ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  const filteredGroupTypesOptions = useLicenseFilter<ISelectOption>(groupTypesOptions, {
    '8': 'Camera',
    '12': 'Lockset',
    '13': 'Facegate',
    '17': 'ContLock',
    '18': 'Intercom',
  })

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IGroupFormData>({
    GroupName: '',
    GroupDesc: '',
    Partition: null,
    GroupType: null,
    GroupItemIds: [],
  })

  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IGroupFormData>>(
    {},
    scrollToErrorElement
  )

  // Fetch the details of the Group from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IGroupResult>>(
    queryId ? groupApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { GroupName, GroupDesc, Partition, GroupType, GroupItems } = data.data

      const savedPartition = {
        value: Partition.PartitionNo.toString(),
        label: Partition.PartitionName,
      }
      const savedGroupType = findSelectOption(filteredGroupTypesOptions, GroupType)

      setFormData({
        GroupName,
        GroupDesc,
        Partition: savedPartition,
        GroupType: savedGroupType,
        GroupItemIds: GroupItems.map((groupItem) => groupItem.Items.No.toString()),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(groupApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.groupInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateGroupFormData(formData)

    // If there are errors, display them and do not submit the form
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
      GroupName: formData.GroupName,
      GroupDesc: formData.GroupDesc,
      GroupType: formData.GroupType?.value,
      GroupItemIds: formData.GroupItemIds,
      PartitionNo: formData.Partition?.value,
    }
    trigger(JSON.stringify(modifiedFormData))
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
      link: routeProperty.groupInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <GroupForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={isLoading}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.groupInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditGroup
