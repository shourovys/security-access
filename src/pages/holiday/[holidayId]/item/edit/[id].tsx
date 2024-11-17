import { sendPutRequest } from '../../../../../api/swrConfig'
import { holidayItemApi } from '../../../../../api/urls'
import Page from '../../../../../components/HOC/Page'
import FormContainer from '../../../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../../../components/layout/Breadcrumbs'
import HolidayItemForm from '../../../../../components/pages/holiday/holidayItem/form/HolidayItemForm'
import useStateWithCallback from '../../../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../../../types/components/actionButtons'
import { THandleInputChange } from '../../../../../types/components/common'
import { INewFormErrors, ISingleServerResponse } from '../../../../../types/pages/common'
import { IHolidayItemFormData, IHolidayItemResult } from '../../../../../types/pages/holidayItem'
import { applyIcon, cancelIcon } from '../../../../../utils/icons'
import scrollToErrorElement from '../../../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../../../utils/toast'
import validateHolidayItemFormData from '../../../../../utils/validation/holidayItem'
import t from '../../../../../utils/translator'

// Component to edit a Holiday Item
function EditHolidayItem() {
  const navigate = useNavigate()
  // Get the holiday ID from the router query
  const params = useParams()
  const holidayId = params.holidayId as string
  const holidayItemId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IHolidayItemFormData>({
    StartDate: '',
    EndDate: '',
    DateName: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IHolidayItemFormData>>(
    {},
    scrollToErrorElement
  )

  // Fetch the details of the Holiday from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IHolidayItemResult>>(
    !holidayItemId || !holidayId ? null : holidayItemApi.details(holidayId, holidayItemId)
  )
  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { DateName, StartDate, EndDate } = data.data
      setFormData({
        StartDate,
        EndDate,
        DateName,
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(
    holidayItemApi.edit(holidayId, holidayItemId),
    sendPutRequest,
    {
      onSuccess: () => {
        editSuccessfulToast()
        navigate(routeProperty.holidayItemInfo.path(holidayId, holidayItemId))
      },
    }
  )

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
      link: routeProperty.holidayItemInfo.path(holidayId, holidayItemId),
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
    //   href: routeProperty.holidayItemInfo.path(holidayId, holidayItemId),
    //   text: t('item info',
    // },
    {
      href: routeProperty.holidayItemInfo.path(holidayId, holidayItemId),
      text: t`Item Edit`,
    },
  ]

  return (
    <Page title={t`Edit Holiday Item`}>
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
          link={routeProperty.holidayItemInfo.path(holidayId, holidayItemId)}
        >
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditHolidayItem
