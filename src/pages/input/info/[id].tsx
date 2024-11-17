import { sendDeleteRequest } from '../../../api/swrConfig'
import { inputApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import {
  IInputFormData,
  IInputResult,
  inputStatOptions,
  inputTypeOptions,
} from '../../../types/pages/input'
import { findSelectOption } from '../../../utils/findSelectOption'
import { editIcon, listIcon } from '../../../utils/icons'
import InputForm from '../../../components/pages/input/form/InputForm'
import t from '../../../utils/translator'

// Component to show details of a input
function InputInfo() {
  const navigate = useNavigate()
  // Get the input ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IInputFormData>({
    InputName: '',
    InputDesc: '',
    InputPort: '',
    InputType: null,
    InputStat: null,
    Partition: null,
    Node: null,
    NodeName: '',
    SubnodeName: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Input from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IInputResult>>(
    isDeleted || !queryId ? null : inputApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      const { InputName, InputDesc, Partition, Node, Subnode, InputPort, InputType, InputStat } =
        data.data

      setFormData({
        InputName,
        InputDesc,
        InputPort: InputPort.toString(),
        InputType: findSelectOption(inputTypeOptions, InputType),
        InputStat: findSelectOption(inputStatOptions, InputStat),
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Node: Node
          ? {
              value: Node.NodeNo.toString(),
              label: Node.NodeName,
            }
          : null,
        NodeName: Node?.NodeName || '',
        SubnodeName: Subnode?.SubnodeName || '',
      })
    }
  }, [data])

  // Define the mutation function to delete the input from the server
  const { trigger: deleteTrigger } = useSWRMutation(inputApi.delete(queryId), sendDeleteRequest, {
    // Show a success message and redirect to input list page on successful delete
    onSuccess: () => {
      navigate(routeProperty.input.path(), { replace: true })
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
      link: routeProperty.inputEdit.path(queryId),
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
      link: routeProperty.input.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <InputForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default InputInfo
