import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { backupScheduleApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import BackupScheduleForm from '../../../components/pages/backupSchedule/form/BackupScheduleForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import {
  IBackupScheduleInfoFormData,
  IBackupScheduleResult,
  backupScheduleMediaOptions,
} from '../../../types/pages/backupSchedule'
import { ISingleServerResponse } from '../../../types/pages/common'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a backupSchedule
function BackupScheduleInfo() {
  const navigate = useNavigate()
  // Get the backupSchedule ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IBackupScheduleInfoFormData>({
    Schedule: null,
    BackupName: '',
    BackupDesc: '',
    Media: null,
    BackupData: '',
    BackupTime: 0,
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the BackupSchedule from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IBackupScheduleResult>>(
    isDeleted || !queryId ? null : backupScheduleApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        Schedule,
        BackupName,
        BackupDesc,
        Media,
        BackupData,
        BackupTime,
      }: IBackupScheduleResult = data.data

      setFormData({
        Schedule: {
          value: Schedule.ScheduleNo.toString(),
          label: Schedule.ScheduleName,
        },
        BackupName,
        BackupDesc: BackupDesc || '',
        Media: findSelectOption(backupScheduleMediaOptions, Media),
        BackupData: BackupData.toString(),
        BackupTime: BackupTime,
      })
    }
  }, [data])

  // Define the mutation function to delete the backupSchedule from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    backupScheduleApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to backupSchedule list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.backupSchedule.path(), {
          replace: true,
        })
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
      link: routeProperty.backupScheduleEdit.path(queryId),
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
      link: routeProperty.backupSchedule.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <BackupScheduleForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default BackupScheduleInfo
