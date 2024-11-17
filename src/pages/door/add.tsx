import { sendPostRequest } from '../../api/swrConfig'
import { doorApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import DoorAddForm from '../../components/pages/door/form/DoorAddForm'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { toast } from 'react-hot-toast'
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
import { IDoorAddFormData } from '../../types/pages/door'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// The CreateDoor component is responsible for rendering a form to create a new door.
function CreateDoor() {
  const navigate = useNavigate()

  // Hook to prompt the user before leaving the page, to prevent losing unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // SWR mutation hook to handle the form submission
  const { trigger, isMutating } = useSWRMutation(doorApi.add, sendPostRequest, {
    onSuccess: () => {
      // Redirect to the door page on successful submission
      navigate(routeProperty.door.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // State for form data and errors
  const [formData, setFormData] = useState<IDoorAddFormData>({
    Partition: null,
    DoorName: '',
    DoorDesc: '',
    Node: null,
    DoorPort: '',
  })

  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Function to handle input changes and update form data and errors
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Function to handle form submission
  const handleSubmit = async () => {
    const errors: IFormErrors = {}

    // Validate form fields
    if (!formData.Partition?.value) {
      errors.Partition = t`Partition is required`
    }
    if (!formData.DoorName) {
      errors.DoorName = t`Door Name is required`
    }
    if (!formData.DoorPort) {
      errors.DoorPort = t`Door Port is required`
    }
    if (!formData.Node?.value) {
      errors.Node = t`Node is required`
    }

    if (Object.keys(errors).length) {
      // If there are errors, update the formErrors state and display error messages
      setFormErrors(errors)
      Object.entries(errors).forEach(([, value]) => {
        if (value) {
          toast.error(value)
        }
      })
      return
    }

    const modifiedFromData = {
      ...formData,
      PartitionNo: Number(formData.Partition?.value),
      NodeNo: Number(formData.Node?.value),
    }

    // Trigger the mutation with the modified form data
    trigger(modifiedFromData)
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
      link: routeProperty.door.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />

      <div className="pt-2" />

      <FormContainer twoPart={false}>
        {/* Render the DoorAddForm component, passing the form data, input change handler, and form errors */}
        <DoorAddForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />
      </FormContainer>

      {/* Render action buttons at the bottom of the form */}
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.door.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateDoor
