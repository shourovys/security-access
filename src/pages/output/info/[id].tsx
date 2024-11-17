import { sendDeleteRequest } from '../../../api/swrConfig'
import { outputApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import useAlert from '../../../hooks/useAlert'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../../types/pages/common'
import {
  IOutputFormData,
  IOutputResult,
  outputStatOptions,
  outputTypeOptions,
} from '../../../types/pages/output'
import { findSelectOption } from '../../../utils/findSelectOption'
import { editIcon, listIcon } from '../../../utils/icons'
import OutputForm from '../../../components/pages/output/form/OutputForm'
import t from '../../../utils/translator'

// Component to show details of a output
function OutputInfo() {
  const navigate = useNavigate()
  // Get the output ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data
  const [formData, setFormData] = useState<IOutputFormData>({
    Partition: null,
    OutputName: '',
    OutputDesc: '',
    Node: null,
    SubnodeName: '',
    OutputPort: '',
    FollowInput: null,
    Input: null,
    OutputType: null,
    OnTime: '',
    OffTime: '',
    Repeat: '',
    OutputStat: null,
  })

  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Output from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IOutputResult>>(
    isDeleted || !queryId ? null : outputApi.details(queryId)
  )
  useEffect(() => {
    if (data) {
      const {
        OutputName,
        OutputDesc,
        OutputPort,
        OutputType,
        OnTime,
        OffTime,
        Repeat,
        OutputStat,
        Partition,
        Node,
        Subnode,
        FollowInput,
        Input,
      } = data.data

      setFormData({
        Partition: {
          value: Partition.PartitionNo?.toString(),
          label: Partition.PartitionName,
        },
        OutputName,
        OutputDesc,
        Node: Node
          ? {
              value: Node.NodeNo?.toString(),
              label: Node.NodeName,
            }
          : null,
        SubnodeName: Subnode?.SubnodeName || '',
        OutputPort: OutputPort.toString(),
        FollowInput: findSelectOption(booleanSelectOption, FollowInput),
        Input: Input
          ? {
              value: Input.InputNo?.toString(),
              label: Input.InputName,
            }
          : null,
        OutputType: findSelectOption(outputTypeOptions, OutputType),
        OnTime: OnTime.toString(),
        OffTime: OffTime.toString(),
        Repeat: Repeat.toString(),
        OutputStat: findSelectOption(outputStatOptions, OutputStat),
      })
    }
  }, [data])

  // Define the mutation function to delete the output from the server
  const { trigger: deleteTrigger } = useSWRMutation(outputApi.delete(queryId), sendDeleteRequest, {
    // Show a success message and redirect to output list page on successful delete
    onSuccess: () => {
      navigate(routeProperty.output.path(), { replace: true })
    },
    // If error occurred - make delete false
    onError: () => {
      setIsDeleted(false)
    },
  })
  // Define the function to call delete mutation with Alert Dialog
  // const handleDelete = () => {
  //   const deleteMutation = () => {
  //     setIsDeleted(true)
  //     return deleteTrigger()
  //   }
  //   openAlertDialogWithPromise(deleteMutation, { success: t`Successful` })
  // }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.outputEdit.path(queryId),
    },
    // {
    //   color: 'danger',
    //   icon: deleteIcon,
    //   text: t('Delete',
    //   onClick: handleDelete,
    //   isLoading: deleteIsLoading,
    // },
    {
      color: 'danger',
      icon: listIcon,
      text: t`List`,
      link: routeProperty.output.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <OutputForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default OutputInfo
