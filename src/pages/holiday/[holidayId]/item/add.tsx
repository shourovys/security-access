import { sendPostRequest } from '../../../../api/swrConfig'
import { holidayItemApi } from '../../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../../components/HOC/Page'
import FormContainer from '../../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../../components/layout/Breadcrumbs'
import HolidayItemForm from '../../../../components/pages/holiday/holidayItem/form/HolidayItemForm'
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
import { IHolidayItemFormData } from '../../../../types/pages/holidayItem'
import { applyIcon, cancelIcon } from '../../../../utils/icons'
import scrollToErrorElement from '../../../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../../../utils/toast'
import validateHolidayItemFormData from '../../../../utils/validation/holidayItem'
import serverErrorHandler from '../../../../utils/serverErrorHandler'
import t from '../../../../utils/translator'
// Component to create a Holiday Item
function CreateHolidayItem() {
  const navigate = useNavigate()
  // Get the holiday ID from the router query
  const params = useParams()
  const holidayId = params.holidayId as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IHolidayItemFormData>({
    StartDate: '',
    EndDate: '',
    DateName: '',
  })

  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IHolidayItemFormData>>(
    {},
    scrollToErrorElement
  )

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(holidayItemApi.add(holidayId), sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to holiday list page on success
      navigate(routeProperty.holidayInfo.path(holidayId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateHolidayItemFormData(formData)

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
      DateName: formData.DateName,
      StartDate: formData.StartDate,
      EndDate: formData.EndDate,
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
      link: routeProperty.holiday.path(),
    },
  ]

  const breadcrumbsPageRoutes = [
    {
      href: routeProperty.holiday.path(),
      text: t`Holiday`,
    },
    {
      href: routeProperty.holidayInfo.path(holidayId),
      text: t`Information`,
    },
    // {
    //   href: routeProperty.holidayInfo.path(holidayId),
    //   text: t('holiday item',
    // },
    {
      href: routeProperty.holidayItemCreate.path(holidayId),
      text: t`Holiday Item Add`,
    },
  ]

  return (
    <Page title={t`Add Holiday Item`}>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        pageTitle={t`Holiday Item`}
        pageRoutes={breadcrumbsPageRoutes}
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <HolidayItemForm
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
        <Button size="large" color="cancel" link={routeProperty.holiday.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateHolidayItem
