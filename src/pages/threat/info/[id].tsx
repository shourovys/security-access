import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { threatApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ThreatForm from '../../../components/pages/threat/form/ThreatForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IThreatFormData, IThreatResult, threatLevelOptions } from '../../../types/pages/threat'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a threat
function ThreatInfo() {
  const navigate = useNavigate()
  // Get the threat ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IThreatFormData>({
    ThreatName: '',
    ThreatDesc: '',
    Partition: null,
    ThreatLevel: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Threat from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IThreatResult>>(
    isDeleted || !queryId ? null : threatApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { ThreatName, ThreatDesc, Partition, ThreatLevel } = data.data
      setFormData({
        ThreatName,
        ThreatDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        ThreatLevel: findSelectOption(threatLevelOptions, ThreatLevel)?.label,
      })
    }
  }, [data])

  // Define the mutation function to delete the threat from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    threatApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to threat list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.threat.path(), { replace: true })
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
      link: routeProperty.threatEdit.path(queryId),
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
      link: routeProperty.threat.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ThreatForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default ThreatInfo
