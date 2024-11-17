import { sendDownloadRequest, sendPostRequest } from '../../api/swrConfig'
import { archiveApi } from '../../api/urls'
import { commonApi } from '../../api/urls/common'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import ArchiveFrom from '../../components/pages/maintenance/ArchiveFrom'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  ICommandResponse,
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../types/pages/common'
import { IArchiveFormData, maintenanceUpdateMediaOptions } from '../../types/pages/maintenance'
import Icon, { applyIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../utils/toast'
import blobDownloader from '../../utils/blobDownloader'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'
import FormActionButtonsContainer from '../../components/HOC/style/form/FormActionButtonsContainer'
import Button from '../../components/atomic/Button'
import useAlert from '../../hooks/useAlert'

// Component to show details of archive
function ArchiveInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IArchiveFormData>({
    MediaType: maintenanceUpdateMediaOptions[0],
    LogNo: '0',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)
  const { openAlertDialogWithPromise } = useAlert()

  // Archive the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to download file from the server
  const { trigger: downloadFileTrigger } = useSWRMutation(
    commonApi.downloadFile,
    sendDownloadRequest
  )

  // Define the mutation function to send the form data to the server
  const { trigger } = useSWRMutation(
    archiveApi.edit,
    sendPostRequest,
    // sendPostRequestWithFile,
    {
      onSuccess: (data: ICommandResponse<string>) => {
        // Perform a download of the response URL
        if (data?.cgi?.data && formData.MediaType?.value === 'UserPC') {
          downloadFileTrigger({ Type: 'Archive', FileName: data?.cgi?.data }).then((blob) => {
            if (blob) blobDownloader(blob, data?.cgi?.data)
          })
          // editSuccessfulToast(`Archive file is downloading`)
        } else {
          // editSuccessfulToast()
        }
      },

      onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
        serverErrorHandler(error, setFormErrors)
      },
    }
  )

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.MediaType?.value) {
      errors.media_type = t`Media is required`
    }
    if (!formData.LogNo) {
      errors.LogNo = t`Archive Log No is required`
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
    const modifiedFormData = {
      MediaType: formData.MediaType?.value,
      LogNo: Number(formData.LogNo),
    }

    openAlertDialogWithPromise(
      () => trigger(modifiedFormData),
      {
        success: t`Success`,
      },
      t('Do you want to Archive?')
    )
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActionsButtons: IActionsButton[] = [
    // {
    //   icon: applyIcon,
    //   text: t`Archive`,
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
            href: routeProperty.archive.path(),
            text: t`Archive`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ArchiveFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      <FormActionButtonsContainer allowsShow>
        <Button size="large" onClick={handleSubmit}>
          <Icon icon={applyIcon} />
          <span>{t`Archive`}</span>
        </Button>
      </FormActionButtonsContainer>
    </Page>
  )
}

export default ArchiveInfo
