import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPutRequest } from '../../../../../api/swrConfig'
import { scheduleItemApi } from '../../../../../api/urls'
import Page from '../../../../../components/HOC/Page'
import FormContainer from '../../../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../../../components/layout/Breadcrumbs'
import ScheduleItemDateForm from '../../../../../components/pages/schedule/scheduleItem/form/ScheduleItemDateForm'
import ScheduleItemTimeForm from '../../../../../components/pages/schedule/scheduleItem/form/ScheduleItemTimeForm'
import useStateWithCallback from '../../../../../hooks/useStateWithCallback'
import routeProperty from '../../../../../routes/routeProperty'
import { IActionsButton } from '../../../../../types/components/actionButtons'
import { THandleInputChange } from '../../../../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../../../types/pages/common'
import {
  IScheduleItemFormData,
  IScheduleItemResult,
  monthdayOptions,
  scheduleTimeTypeOptions,
  scheduleTypeOptions,
} from '../../../../../types/pages/scheduleItem'
import { findSelectOption } from '../../../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../../../utils/icons'
import { binaryToIndex, indexToBinary } from '../../../../../utils/indexToBinary'
import scrollToErrorElement from '../../../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../../../../utils/toast'
import t from '../../../../../utils/translator'
import validateScheduleItemFormData from '../../../../../utils/validation/scheduleItem'

// Component to edit a Schedule Item
function EditScheduleItem() {
  const navigate = useNavigate()
  // Get the schedule ID from the router query
  const params = useParams()
  const scheduleId = params.scheduleId as string
  const scheduleItemId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IScheduleItemFormData>({
    ScheduleType: null,
    Weekdays: undefined,
    Monthday: undefined,
    OneDate: undefined,
    TimeType: null,
    StartTime: undefined,
    EndTime: undefined,
    Latitude: '',
    Longitude: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IScheduleItemFormData>>(
    {},
    scrollToErrorElement
  )

  // Fetch the details of the Schedule from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IScheduleItemResult>>(
    !scheduleItemId || !scheduleId ? null : scheduleItemApi.details(scheduleId, scheduleItemId)
  )
  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        ScheduleType,
        Weekdays,
        Monthday,
        OneDate,
        Latitude,
        Longitude,
        TimeType,
        StartTime,
        EndTime,
      } = data.data
      setFormData({
        ScheduleType: findSelectOption(scheduleTypeOptions, ScheduleType),
        Weekdays: Weekdays ? binaryToIndex(Weekdays) : undefined,
        // Monthday: findSelectOption (monthdayOptions, Monthday) ,
        Monthday: findSelectOption(monthdayOptions, Monthday?.toString() || ''),
        OneDate: OneDate ? OneDate : undefined,
        TimeType: findSelectOption(scheduleTimeTypeOptions, TimeType),
        StartTime: StartTime ? StartTime : undefined,
        EndTime: EndTime ? EndTime : undefined,
        Latitude: Latitude.toString(),
        Longitude: Longitude.toString(),
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
    scheduleItemApi.edit(scheduleId, scheduleItemId),
    sendPutRequest,
    {
      onSuccess: () => {
        editSuccessfulToast()
        navigate(routeProperty.scheduleItemInfo.path(scheduleId, scheduleItemId))
      },
      onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
        serverErrorHandler(error, setFormErrors)
      },
    }
  )

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateScheduleItemFormData(formData)

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
      ScheduleType: formData.ScheduleType?.value,
      Weekdays:
        formData.ScheduleType?.value === '1' && formData.Weekdays
          ? indexToBinary(formData.Weekdays, 8)
          : undefined,
      Monthday: formData.ScheduleType?.value === '2' ? Number(formData.Monthday?.value) : undefined,
      OneDate: formData.ScheduleType?.value === '3' ? formData.OneDate : undefined,
      TimeType: formData.TimeType?.value,
      StartTime: formData.StartTime,
      EndTime: formData.EndTime,
      ...(formData.TimeType?.value !== '0' && { Latitude: formData.Latitude.toString() }),
      ...(formData.TimeType?.value !== '0' && { Longitude: formData.Longitude.toString() }),
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
      link: routeProperty.scheduleItemInfo.path(scheduleId, scheduleItemId),
    },
  ]

  const breadcrumbsPageRoutes = [
    {
      href: routeProperty.schedule.path(),
      text: t`Schedule`,
    },
    {
      href: routeProperty.scheduleInfo.path(scheduleId),
      text: t`Information`,
    },
    // {
    //   href: routeProperty.scheduleItemInfo.path(scheduleId, scheduleItemId),
    //   text: t('item info',
    // },
    {
      href: routeProperty.scheduleItemInfo.path(scheduleId, scheduleItemId),
      text: t`Item Edit`,
    },
  ]

  return (
    <Page title={t`Edit Schedule Item`}>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        pageTitle={t`Schedule Item`}
        pageRoutes={breadcrumbsPageRoutes}
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ScheduleItemDateForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={isLoading}
        />
        <ScheduleItemTimeForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={isLoading}
          setFormErrors={setFormErrors}
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
          link={routeProperty.scheduleItemInfo.path(scheduleId, scheduleItemId)}
        >
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditScheduleItem
