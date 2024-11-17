import { sendPostRequest } from '../../../../api/swrConfig'
import { actionApi } from '../../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../../components/HOC/Page'
import FormContainer from '../../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../../components/layout/Breadcrumbs'
import ActionForm from '../../../../components/pages/eventAction/Action/form/ActionForm'
import { useDefaultActionElement } from '../../../../hooks/useDefaultOption'
import useStateWithCallback from '../../../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../../types/components/actionButtons'
import { THandleInputChange } from '../../../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../../../types/pages/common'
import { IActionFormData, actionTypesOptions } from '../../../../types/pages/eventAndAction'
import { applyIcon, cancelIcon } from '../../../../utils/icons'
import scrollToErrorElement from '../../../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../../../utils/toast'
import validateActionFormData from '../../../../utils/validation/action'
import serverErrorHandler from '../../../../utils/serverErrorHandler'
import t from '../../../../utils/translator'

// Component to create a Action
function CreateAction() {
  const navigate = useNavigate()
  // Get the eventAction ID from the router query
  const params = useParams()
  const eventActionId = params.eventActionId as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IActionFormData>({
    ActionType: actionTypesOptions[0],
    ActionCtrl: null,
    ActionItemIds: [],
  })

  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IActionFormData>>(
    {},
    scrollToErrorElement
  )

  useDefaultActionElement<IActionFormData>(formData.ActionType?.value, setFormData)

  // setting Action Control option on formData and setting currentActionControlOptions base on ActionType value
  // useEffect(() => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     ActionCtrl: actionControlOptionsState[prevState.ActionType?.value as string][0],
  //   }))
  //   setCurrentActionControlOptions(
  //     formData?.ActionType?.value ? actionControlOptionsState[formData?.ActionType.value] : []
  //   )
  // }, [formData.ActionType?.value])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(actionApi.add(eventActionId), sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to eventAction list page on success
      navigate(routeProperty.eventActionInfo.path(eventActionId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateActionFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      //Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value);
      //   }
      // });
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
      link: routeProperty.eventAction.path(),
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
    //   href: routeProperty.eventActionInfo.path(eventActionId),
    //   text: t('eventAction action',
    // },
    {
      href: routeProperty.actionCreate.path(eventActionId),
      text: t`Action Add`,
    },
  ]

  return (
    <Page title={t`Add Action`}>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        pageTitle={t`Action`}
        pageRoutes={breadcrumbsPageRoutes}
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ActionForm
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
        <Button size="large" color="cancel" link={routeProperty.eventAction.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateAction
