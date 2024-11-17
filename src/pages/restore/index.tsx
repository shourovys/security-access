import { sendPostRequestWithFileAndProgress } from '../../api/swrConfig'
import { restoreApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import RestoreFrom from '../../components/pages/maintenance/RestoreFrom'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../types/pages/common'
import {
  IRestoreFormData,
  maintenanceUpdateMediaOptions,
  maintenanceBackupOptions,
} from '../../types/pages/maintenance'
import Icon, { applyIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../utils/toast'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'
import FormActionButtonsContainer from '../../components/HOC/style/form/FormActionButtonsContainer'
import Button from '../../components/atomic/Button'
import useAlert from '../../hooks/useAlert'

// Component to show details of restore
function RestoreInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IRestoreFormData>({
    Action: 'restore',
    MediaType: maintenanceUpdateMediaOptions[0],
    File: null,
    FileName: null,
    BackupType: maintenanceBackupOptions[0].value,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  const { openAlertDialogWithPromise } = useAlert()

  // Restore the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })

    if (name === 'MediaType') {
      setFormData((state) => ({ ...state, FileName: null }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger } = useSWRMutation(restoreApi.edit, sendPostRequestWithFileAndProgress, {
    onSuccess: () => {
      // editSuccessfulToast()
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
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
    if (!formData.BackupType) {
      errors.BackupType = t`Backup Data is required`
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

    // Modify form data to match API requirements and trigger the mutation
    // const modifiedFormData = {
    //   Action: formData.Action,
    //   MediaType: formData.MediaType?.value,
    //   ...(formData.MediaType?.value === 'UserPC' && {
    //     File: formData.File,
    //     FileName: '',
    //   }),
    //   ...(formData.MediaType?.value !== 'UserPC' && {
    //     File: '',
    //     FileName: formData.FileName?.value,
    //   }),
    //   BackupType: formData.BackupType,
    // }

    const modifiedFormData = new FormData()
    modifiedFormData.append('Action', formData.Action)
    modifiedFormData.append('MediaType', formData.MediaType?.value || '')
    modifiedFormData.append('BackupType', formData.BackupType || '')
    if (formData.MediaType?.value === 'UserPC') {
      modifiedFormData.append('File', formData.File ? formData.File[0] : '')
      modifiedFormData.append('FileName', '')
    } else {
      modifiedFormData.append('File', '')
      modifiedFormData.append('FileName', formData.FileName?.value || '')
    }

    openAlertDialogWithPromise(
      () => trigger(modifiedFormData),
      {
        success: t`Success`,
      },
      t(`Do you want to Restore ?`)
    )
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActionsButtons: IActionsButton[] = [
    // {
    //   icon: applyIcon,
    //   text: t`Restore`,
    //   onClick: handleSubmit,
    //   isLoading: isMutating,
    // },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        pageRoutes={[
          {
            href: routeProperty.restore.path(),
            text: t`Restore`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <RestoreFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      <FormActionButtonsContainer allowsShow>
        <Button size="large" onClick={handleSubmit}>
          <Icon icon={applyIcon} />
          <span>Restore</span>
        </Button>
      </FormActionButtonsContainer>
    </Page>
  )
}

export default RestoreInfo
