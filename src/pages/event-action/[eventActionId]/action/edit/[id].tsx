import { sendPutRequest } from '../../../../../api/swrConfig'
import { actionApi } from '../../../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../../../components/HOC/Page'
import FormContainer from '../../../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../../../components/layout/Breadcrumbs'
import ActionForm from '../../../../../components/pages/eventAction/Action/form/ActionForm'
import { useActionElementSelectData } from '../../../../../hooks/useSelectData'
import useStateWithCallback from '../../../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../../../types/components/actionButtons'
import { THandleInputChange } from '../../../../../types/components/common'
import {
  IListServerResponse,
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../../../types/pages/common'
import {
  IActionFormData,
  IActionResult,
  IEventElementsResult,
  actionTypesOptions,
} from '../../../../../types/pages/eventAndAction'
import { SERVER_QUERY } from '../../../../../utils/config'
import { findSelectOption } from '../../../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../../../utils/icons'
import scrollToErrorElement from '../../../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../../../utils/toast'
import validateActionFormData from '../../../../../utils/validation/action'
import serverErrorHandler from '../../../../../utils/serverErrorHandler'
import t from '../../../../../utils/translator'
import useLicenseFilter from '../../../../../hooks/useLicenseFilter'

// Component to edit a Action
function EditAction() {
  const navigate = useNavigate()
  // Get the eventAction ID from the router query
  const params = useParams()
  const eventActionId = params.eventActionId as string
  const actionId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))
  const filteredActionTypesOptions = useLicenseFilter(actionTypesOptions, {
    '10': 'Camera',
    '11': 'Channel',
    '12': 'Lockset',
    '13': 'Facegate',
    '15': 'ContLock',
    '16': 'Intercom',
  })

  // const [actionControlOptionsState, setActionControlOptionsState] = useState(actionControlOptions)

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IActionFormData>({
    ActionType: null,
    ActionCtrl: null,
    ActionItemIds: [],
  })

  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IActionFormData>>(
    {},
    scrollToErrorElement
  )

  // Fetch elements by type from the server
  const { isLoading: elementsLoading, data: elementsData } = useSWR<
    IListServerResponse<IEventElementsResult>
  >(
    !formData?.ActionType?.value
      ? null
      : actionApi.elements(
          `${SERVER_QUERY.selectorDataQuery}&ActionType=${formData?.ActionType?.value}`
        )
  )

  // I think this part is unncessary for show data from the database  --rubel.
  // useEffect(() => {
  //   if (elementsLoading) {
  //     return
  //   }
  //   if (elementsData?.data.ActionControls) {
  //     handleInputChange('ActionCtrl', {
  //       value: elementsData?.data?.ActionControls[0].value.toString(),
  //       label: elementsData?.data?.ActionControls[0].text,
  //     })
  //   } else {
  //     handleInputChange('ActionCtrl', null)
  //   }
  // }, [elementsData?.data.ActionControls, elementsLoading])

  // Fetch the details of the Holiday from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IActionResult>>(
    !actionId || !eventActionId ? null : actionApi.details(eventActionId, actionId)
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
        ActionType: findSelectOption(filteredActionTypesOptions, ActionType),
        ActionCtrl: ActionCtrlSelectData
          ? {
              label: ActionCtrlSelectData.text,
              value: ActionCtrlSelectData.value.toString(),
            }
          : null,
        ActionItemIds: Items ? Items?.map((item) => item.ItemNo.toString()) : [],
      })
    }
  }, [data, eventElements])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(
    actionApi.edit(eventActionId, actionId),
    sendPutRequest,
    {
      onSuccess: () => {
        editSuccessfulToast()
        navigate(routeProperty.actionInfo.path(eventActionId, actionId))
      },
      onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
        serverErrorHandler(error, setFormErrors)
      },
    }
  )

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateActionFormData(formData)

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
      ActionType: formData.ActionType?.value,
      ActionCtrl: formData.ActionCtrl?.value,
      ActionItemIds: formData.ActionItemIds,
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
      link: routeProperty.actionInfo.path(eventActionId, actionId),
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
    // {
    //   href: routeProperty.eventActionInfo.path(eventActionId, actionId),
    //   text: t('action info',
    // },
    {
      href: routeProperty.eventActionInfo.path(eventActionId, actionId),
      text: t`Action Edit`,
    },
  ]

  return (
    <Page title={t`Edit Action`}>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        pageTitle={t`Event Action`}
        pageRoutes={breadcrumbsPageRoutes}
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ActionForm
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
        <Button
          size="large"
          color="danger"
          link={routeProperty.actionInfo.path(eventActionId, actionId)}
        >
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditAction
