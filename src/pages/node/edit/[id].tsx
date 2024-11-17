import { sendPutRequest } from '../../../api/swrConfig'
import { nodeApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
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
} from '../../../types/pages/common'
import { INodeFormData, INodeResult, nodeFaultTypeOptions } from '../../../types/pages/node'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import NodeForm from '../../../components/pages/node/form/NodeForm'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'

// Component to show details of a node
function EditNode() {
  const navigate = useNavigate()
  // Get the node ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<INodeFormData>({
    NodeName: '',
    NodeDesc: '',
    Mac: '',
    PowerFaultType: null,
    TamperType: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Node from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<INodeResult>>(
    queryId ? nodeApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { NodeName, NodeDesc, Mac, PowerFaultType, TamperType } = data.data

      setFormData({
        NodeName,
        NodeDesc: NodeDesc,
        Mac,
        PowerFaultType: findSelectOption(nodeFaultTypeOptions, PowerFaultType),
        TamperType: findSelectOption(nodeFaultTypeOptions, TamperType),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(nodeApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.nodeInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.NodeName) {
      errors.NodeName = t`Node Name is required`
    }
    if (!formData.Mac) {
      errors.Mac = t`MAC Address is required`
    } else if (formData.Mac.length > 17) {
      errors.Mac = t`MAC Address should be less than 17 characters`
    }
    if (!formData.PowerFaultType?.value) {
      errors.PowerFaultType = t`Power Fault Type is required`
    }
    if (!formData.TamperType?.value) {
      errors.TamperType = t`Tamper Type is required`
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      NodeName: formData.NodeName,
      NodeDesc: formData.NodeDesc,
      Mac: formData.Mac,
      PowerFaultType: Number(formData.PowerFaultType?.value),
      TamperType: Number(formData.TamperType?.value),
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
      link: routeProperty.nodeInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <NodeForm
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
        <Button size="large" color="cancel" link={routeProperty.nodeInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditNode
