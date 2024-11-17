import { sendPostRequestWithFile } from '../../api/swrConfig'
import { getBackApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import GetBackFrom from '../../components/pages/maintenance/GetBackFrom'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import { IFormErrors } from '../../types/pages/common'
import { IGetBackFormData, maintenanceBackupMediaOptions } from '../../types/pages/maintenance'
import Icon, { applyIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'
import FormActionButtonsContainer from '../../components/HOC/style/form/FormActionButtonsContainer'
import Button from '../../components/atomic/Button'
import useAlert from '../../hooks/useAlert'

// Component to show details of getBack
function GetBackInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IGetBackFormData>({
    MediaType: maintenanceBackupMediaOptions[0],
    File: null,
    FileName: null,
    DeleteExisting: { value: '0', label: t`No` },
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  const { openAlertDialogWithPromise } = useAlert()

  // Restore the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(getBackApi.edit, sendPostRequestWithFile, {
    // onSuccess: () => {
    //   editSuccessfulToast()
    // },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.MediaType?.value) {
      errors.media_type = t`Media is required`
    }
    if (formData.MediaType?.value !== 'UserPC' && !formData.FileName?.value) {
      errors.FileName = t`File is required`
    } else if (formData.MediaType?.value === 'UserPC' && !formData.File) {
      errors.File = t`File is required.`
    }

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

    const form = new FormData()

    form.append('MediaType', formData.MediaType?.value as string)
    form.append('DeleteExisting', formData.DeleteExisting?.value as string)

    if (formData.MediaType?.value === 'UserPC') {
      if (formData.File) form.append('File', formData.File[0] as File)
    } else {
      form.append('FileName', formData.FileName?.value as string)
    }

    openAlertDialogWithPromise(
      () => trigger(form),
      {
        success: t`Success`,
      },
      t(`Do you want to Getback?`)
    )
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActionsButtons: IActionsButton[] = [
    // {
    //   icon: applyIcon,
    //   text: t`Getback`,
    //   onClick: handleSubmit,
    //   isLoading: isMutating,
    // },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        pageRoutes={[
          {
            href: routeProperty.getBack.path(),
            text: t`Getback`,
          },
        ]}
        pageTitle="Getback"
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <GetBackFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      <FormActionButtonsContainer allowsShow={true}>
        <Button size="large" onClick={handleSubmit}>
          <Icon icon={applyIcon} />
          <span>{t`Getback`}</span>
        </Button>
      </FormActionButtonsContainer>
    </Page>
  )
}

export default GetBackInfo
