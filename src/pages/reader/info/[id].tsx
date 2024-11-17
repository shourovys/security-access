import { sendDeleteRequest } from '../../../api/swrConfig'
import { readerApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ReaderForm from '../../../components/pages/reader/form/ReaderForm'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IReaderInfoFormData, IReaderResult } from '../../../types/pages/reader'
import { editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a reader
function ReaderInfo() {
  const navigate = useNavigate()
  // Get the reader ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  // const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IReaderInfoFormData>({
    ReaderName: '',
    ReaderDesc: '',
    Node: null,
    Subnode: null,
    ReaderPort: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Reader from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IReaderResult>>(
    isDeleted || !queryId ? null : readerApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { ReaderName, ReaderDesc, Node, Subnode, ReaderPort } = data.data
      setFormData({
        ReaderName,
        ReaderDesc,
        Node: {
          value: Node.NodeNo.toString(),
          label: Node.NodeName,
        },
        Subnode: {
          value: Subnode.SubnodeNo.toString(),
          label: Subnode.SubnodeName,
        },
        ReaderPort: ReaderPort?.toString(),
      })
    }
  }, [data])

  // Define the mutation function to delete the reader from the server
  const { trigger: deleteTrigger } = useSWRMutation(readerApi.delete(queryId), sendDeleteRequest, {
    // Show a success message and redirect to reader list page on successful delete
    onSuccess: () => {
      navigate(routeProperty.reader.path(), { replace: true })
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
      link: routeProperty.readerEdit.path(queryId),
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
      link: routeProperty.reader.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ReaderForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default ReaderInfo
