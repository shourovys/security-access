import { sendPutRequest } from '../../../api/swrConfig'
import { intercomApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
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
import {
  IIntercomFormData,
  IIntercomResult,
  intercomGateTypeOptions,
  intercomOpenDoorWayOptions,
  intercomVerifyModeOptions,
} from '../../../types/pages/intercom'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import validateIntercomFormData from '../../../utils/validation/intercom'
import IntercomForm from '../../../components/pages/intercom/form/IntercomForm'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'

// Component to edit a Intercom
function EditIntercom() {
  const navigate = useNavigate()
  // Get the intercom ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IIntercomFormData>({
    IntercomName: '',
    IntercomDesc: '',
    Partition: null,
    Node: null,
    IpAddress: '',
    ApiPort: '',
    UserId: '',
    Password: '',
    DeviceId: '',
    OpenDoorWay: null,
    GateType: null,
    VerifyMode: null,
    FaceThreshold: '',
    SipGateId: '',
    SipPassword: '',
    SipOperatorId: '',
    SipDtmfLock: '',
    SipIncomingCall: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Intercom from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IIntercomResult>>(
    queryId ? intercomApi.details(queryId) : null
  )
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const {
        IntercomName,
        IntercomDesc,
        Partition,
        Node,
        IpAddress,
        ApiPort,
        UserId,
        Password,
        DeviceId,
        OpenDoorWay,
        GateType,
        VerifyMode,
        FaceThreshold,
        SipGateId,
        SipPassword,
        SipOperatorId,
        SipDtmfLock,
        SipIncomingCall,
      } = data.data

      setFormData({
        IntercomName,
        IntercomDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Node: {
          value: Node.NodeNo.toString(),
          label: Node.NodeName,
        },
        IpAddress,
        ApiPort: ApiPort.toString(),
        UserId,
        Password,
        DeviceId,
        OpenDoorWay: findSelectOption(intercomOpenDoorWayOptions, OpenDoorWay),
        GateType: findSelectOption(intercomGateTypeOptions, GateType),
        VerifyMode: findSelectOption(intercomVerifyModeOptions, VerifyMode),
        FaceThreshold: FaceThreshold.toString(),
        SipGateId: SipGateId.toString(),
        SipPassword,
        SipOperatorId: SipOperatorId.toString(),
        SipDtmfLock: SipDtmfLock.toString(),
        SipIncomingCall: findSelectOption(booleanSelectOption, SipIncomingCall),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(intercomApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.intercomInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateIntercomFormData(formData)

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
      IntercomName: formData.IntercomName,
      IntercomDesc: formData.IntercomDesc,
      PartitionNo: formData.Partition?.value,
      NodeNo: formData.Node?.value,
      IpAddress: formData.IpAddress,
      ApiPort: parseInt(formData.ApiPort),
      UserId: formData.UserId,
      Password: formData.Password,
      DeviceId: formData.DeviceId,
      OpenDoorWay: formData.OpenDoorWay?.value,
      GateType: formData.GateType?.value,
      VerifyMode: formData.VerifyMode?.value,
      FaceThreshold:
        formData.GateType?.value !== '0' && formData.GateType?.value !== '1'
          ? parseInt(formData.FaceThreshold)
          : 0,
      SipGateId:
        formData.GateType?.value !== '0' && formData.GateType?.value !== '2'
          ? formData.SipGateId
          : '',
      SipPassword:
        formData.GateType?.value !== '0' && formData.GateType?.value !== '2'
          ? formData.SipPassword
          : '',
      SipOperatorId:
        formData.GateType?.value !== '0' && formData.GateType?.value !== '2'
          ? formData.SipOperatorId
          : '',
      SipDtmfLock:
        formData.GateType?.value !== '0' && formData.GateType?.value !== '2'
          ? formData.SipDtmfLock
          : 0,
      SipIncomingCall:
        formData.GateType?.value !== '0' && formData.GateType?.value !== '2'
          ? formData.SipIncomingCall?.value
          : 0,
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
      link: routeProperty.intercomInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <IntercomForm
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
        <Button size="large" color="cancel" link={routeProperty.intercomInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditIntercom
