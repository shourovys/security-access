import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { archiveScheduleApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ArchiveScheduleForm from '../../../components/pages/archiveSchedule/form/ArchiveScheduleForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import {
  IArchiveScheduleInfoFormData,
  IArchiveScheduleResult,
  archiveScheduleMediaOptions,
} from '../../../types/pages/archiveSchedule'
import { ISingleServerResponse, booleanSelectOption } from '../../../types/pages/common'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a archiveSchedule
function ArchiveScheduleInfo() {
  const navigate = useNavigate()
  // Get the archiveSchedule ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IArchiveScheduleInfoFormData>({
    Schedule: null,
    ArchiveName: '',
    ArchiveDesc: '',
    Media: null,
    UsageBased: null,
    UsagePercent: '',
    ArchiveTime: 0,
    ArchiveLogNo: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the ArchiveSchedule from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IArchiveScheduleResult>>(
    isDeleted || !queryId ? null : archiveScheduleApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        Schedule,
        ArchiveName,
        ArchiveDesc,
        Media,
        UsageBased,
        UsagePercent,
        ArchiveTime,
        ArchiveLogNo,
      } = data.data

      setFormData({
        Schedule: Schedule
          ? {
              value: Schedule.ScheduleNo.toString(),
              label: Schedule.ScheduleName,
            }
          : null,
        ArchiveName,
        ArchiveDesc: ArchiveDesc || '',
        Media: findSelectOption(archiveScheduleMediaOptions, Media),
        UsageBased: findSelectOption(booleanSelectOption, UsageBased),
        UsagePercent: UsagePercent ? UsagePercent.toString() : '',
        ArchiveTime,
        ArchiveLogNo: ArchiveLogNo.toString(),
      })
    }
  }, [data])

  // Define the mutation function to delete the archiveSchedule from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    archiveScheduleApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to archiveSchedule list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.archiveSchedule.path(), {
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
      link: routeProperty.archiveScheduleEdit.path(queryId),
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
      link: routeProperty.archiveSchedule.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ArchiveScheduleForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default ArchiveScheduleInfo
