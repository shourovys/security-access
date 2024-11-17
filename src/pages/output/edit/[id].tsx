import { sendPutRequest } from '../../../api/swrConfig'
import { outputApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import OutputEditForm from '../../../components/pages/output/form/OutputEditForm'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  booleanSelectOption,
} from '../../../types/pages/common'
import { IOutputEditFormData, IOutputResult, outputTypeOptions } from '../../../types/pages/output'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import validateOutputFormData from '../../../utils/validation/output'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'

// Component to edit a Output
function EditOutput() {
  const navigate = useNavigate()
  // Get the output ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IOutputEditFormData>({
    Partition: null,
    OutputName: '',
    OutputDesc: '',
    Node: null,
    FollowInput: null,
    Input: null,
    OutputType: null,
    OnTime: '',
    OffTime: '',
    Repeat: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)
  // Fetch the details of the Output from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IOutputResult>>(
    queryId ? outputApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      const {
        OutputName,
        OutputDesc,
        OutputType,
        OnTime,
        OffTime,
        Repeat,
        FollowInput,
        Node,
        Input,
        Partition,
        PartitionNo,
      } = data.data

      setFormData({
        OutputName,
        OutputDesc,
        OutputType: findSelectOption(outputTypeOptions, OutputType),
        FollowInput: findSelectOption(booleanSelectOption, FollowInput),
        Node: Node
          ? {
              value: Node.NodeNo?.toString(),
              label: Node.NodeName,
            }
          : null,
        Input: Input
          ? {
              value: Input.InputNo?.toString(),
              label: Input.InputName,
            }
          : null,
        OnTime: OnTime.toString(),
        OffTime: OffTime.toString(),
        Repeat: Repeat.toString(),
        Partition: {
          value: PartitionNo?.toString(),
          label: Partition.PartitionName,
        },
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(outputApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.outputInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateOutputFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      // Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value);
      //   }
      // });
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      OutputName: formData.OutputName,
      OutputDesc: formData.OutputDesc,
      OutputType: formData.OutputType?.value,
      FollowInput: formData.FollowInput?.value,
      Input: formData.Input?.value,
      OnTime: formData.OnTime,
      OffTime: formData.OffTime,
      Repeat: formData.Repeat,
      PartitionNo: formData.Partition?.value,
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
      link: routeProperty.outputInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <OutputEditForm
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
        <Button size="large" color="cancel" link={routeProperty.outputInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditOutput
