import { sendPostRequest } from '../../api/swrConfig'
import { outputApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import OutputGroupEditForm from '../../components/pages/output/form/OutputGroupEditForm'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useSearchParams } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange, THandleInputSelect } from '../../types/components/common'
import {
  INewFormErrors,
  ISelectedInputFields,
  ISingleServerResponse,
} from '../../types/pages/common'
import {
  IOutputGroupEditFormData,
  IOutputResult,
  outputTypeOptions,
} from '../../types/pages/output'
import { findSelectOption } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import { editSuccessfulToast, groupEditSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to edit a Output
function OutputGroupEdit() {
  const navigate = useNavigate()
  // Get the output IDs from the router query
  const [searchParams] = useSearchParams()
  const queryIds: string[] = searchParams.get('ids')?.split(',') || ['']

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IOutputGroupEditFormData>({
    Partition: null,
    OutputType: null,
    OnTime: '',
    OffTime: '',
    Repeat: '',
  })
  const [formErrors, setFormErrors] = useState<INewFormErrors<IOutputGroupEditFormData>>({})

  // state for track is output field is select
  const [selectedInputFields, setSelectedInputFields] = useState<
    ISelectedInputFields<IOutputGroupEditFormData>
  >({})

  // Fetch the details of the Output from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IOutputResult>>(
    queryIds[0] ? outputApi.details(queryIds[0]) : null
  )

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Partition, OutputType, OnTime, OffTime, Repeat } = data.data

      setFormData({
        Partition: {
          label: Partition.PartitionName,
          value: Partition.PartitionNo.toString(),
        },
        OutputType: findSelectOption(outputTypeOptions, OutputType),
        OnTime: OnTime.toString(),
        OffTime: OffTime.toString(),
        Repeat: Repeat.toString(),
      })
    }
  }, [data])

  // Update the form data when any output changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Update the selected input fields when any input selected
  const handleInputSelect: THandleInputSelect = (name, value) => {
    if (name === 'Output') {
      setSelectedInputFields((state) => ({
        ...state,
        Partition: value,
        OutputType: value,
        OnTime: value,
        OffTime: value,
        Repeat: value,
      }))
    } else {
      setSelectedInputFields((state) => ({ ...state, [name]: value }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(outputApi.groupEdit, sendPostRequest, {
    onSuccess: () => {
      groupEditSuccessfulToast()
      // redirect to schedule list page on success
      navigate(routeProperty.output.path())
    },
  })

  // Handle the form submission

  const handleSubmit = async () => {
    // const errors = validateOutputFormData(formData)

    // // If there are errors, display them and do not submit the form
    // if (Object.keys(errors).length) {
    //   setFormErrors(errors)
    //   //Object.entries(errors).forEach(([, value]) => {
    //   //   if (value) {
    //   //     errorToast(value)
    //   //   }
    //   // })
    //   return
    // }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      OutputNos: queryIds,
      ...(selectedInputFields.Partition && {
        PartitionNo: formData.Partition?.value,
      }),
      ...(selectedInputFields.OutputType && {
        OutputType: Number(formData.OutputType?.value),
      }),
      ...(selectedInputFields.OnTime && {
        OnTime: Number(formData.OnTime),
      }),
      ...(selectedInputFields.OffTime && {
        OffTime: Number(formData.OffTime),
      }),
      ...(selectedInputFields.Repeat && {
        Repeat: Number(formData.Repeat),
      }),
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
      link: routeProperty.output.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <OutputGroupEditForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          selectedOutputFields={selectedInputFields}
          handleSelect={handleInputSelect}
          isLoading={isLoading}
        />
      </FormContainer>

      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.output.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}
export default OutputGroupEdit
