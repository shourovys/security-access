import { sendPostRequest } from '../../api/swrConfig'
import { viewApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import { useDefaultPartitionOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../types/pages/common'
import { IViewFormData } from '../../types/pages/view'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { addSuccessfulToast } from '../../utils/toast'
import ViewForm from '../../components/pages/view/form/ViewForm'
import t from '../../utils/translator'

// Component to create a View
function CreateView() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))
  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IViewFormData>({
    ViewName: '',
    ViewDesc: '',
    Partition: null,
    ChannelNos: [],
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Set default Partition
  useDefaultPartitionOption<IViewFormData>(setFormData)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(viewApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to view list page on success
      navigate(routeProperty.view.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.ViewName) {
      errors.ViewName = t`View Name is required`
    }
    if (!formData.Partition?.value) {
      errors.Partition = t`Partition is required`
    }
    // if (!formData.ChannelNos.length) {
    //   errors.ChannelNos= t`View Channels are required`
    // }

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
      ViewName: formData.ViewName,
      ViewDesc: formData.ViewDesc,
      ChannelNos: formData.ChannelNos,
      PartitionNo: formData.Partition?.value,
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
      link: routeProperty.view.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ViewForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.view.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateView
