import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../../../api/swrConfig'
import { actionApi } from '../../../../../api/urls'
import Page from '../../../../../components/HOC/Page'
import FormContainer from '../../../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../../../components/layout/Breadcrumbs'
import ActionForm from '../../../../../components/pages/eventAction/Action/form/ActionForm'
import useAlert from '../../../../../hooks/useAlert'
import { useActionElementSelectData } from '../../../../../hooks/useSelectData'
import routeProperty from '../../../../../routes/routeProperty'
import { IActionsButton } from '../../../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../../../types/pages/common'
import {
  IActionFormData,
  IActionResult,
  actionTypesOptions,
} from '../../../../../types/pages/eventAndAction'
import { findSelectOption } from '../../../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../../../utils/icons'
import t from '../../../../../utils/translator'

// Component to show details of a eventAction item
function ActionInfo() {
  const navigate = useNavigate()
  // Get the eventAction ID from the router query
  const params = useParams()
  const eventActionId = params.eventActionId as string
  const actionId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IActionFormData>({
    ActionType: null,
    ActionCtrl: null,
    ActionItemIds: [],
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Holiday from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IActionResult>>(
    isDeleted || !actionId || !eventActionId ? null : actionApi.details(eventActionId, actionId)
  )

  const { data: eventElements } = useActionElementSelectData(false, data?.data.ActionType)

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { Items, ActionType, ActionCtrl } = data.data

      const ActionCtrlSelectData =
        eventElements?.data.ActionControls.length &&
        eventElements?.data.ActionControls.find((control) => control.value === ActionCtrl)

      setFormData({
        ActionType: findSelectOption(actionTypesOptions, ActionType),
        // ActionCtrl:
        //   actionControlOptionsState[ActionType] &&
        //   findSelectOption(actionControlOptionsState[ActionType], ActionCtrl),
        ActionCtrl: ActionCtrlSelectData
          ? { label: ActionCtrlSelectData.text, value: ActionCtrlSelectData.value.toString() }
          : null,
        ActionItemIds: Items ? Items?.map((item) => item.ItemNo.toString()) : [],
        ActionItemNames: Items ? Items?.map((action) => action.ItemName).join(', ') : '',
      })
    }
  }, [data, eventElements])

  // Define the mutation function to delete the eventAction from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    actionApi.delete(eventActionId, actionId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to eventAction list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.eventActionInfo.path(eventActionId), { replace: true })
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
      link: routeProperty.actionEdit.path(eventActionId, actionId),
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
      link: routeProperty.eventActionInfo.path(eventActionId),
    },
  ]

  const breadcrumbsPageRoutes = [
    {
      href: routeProperty.eventAction.path(),
      text: t`Event Action`,
    },
    {
      href: routeProperty.eventActionInfo.path(eventActionId),
      text: t`Information`,
    },
    {
      href: routeProperty.eventActionInfo.path(eventActionId, actionId),
      text: t`Action Info`,
    },
  ]

  return (
    <Page title={t`Info Action`}>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        pageTitle={t`Event Action`}
        pageRoutes={breadcrumbsPageRoutes}
        breadcrumbsActions={breadcrumbsActions}
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ActionForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default ActionInfo
