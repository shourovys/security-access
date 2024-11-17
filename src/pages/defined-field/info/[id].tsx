import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { definedFieldApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import DefinedFieldForm from '../../../components/pages/definedField/form/DefinedFieldFrom'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../../types/pages/common'
import { IDefinedFieldFormData, IDefinedFieldResult } from '../../../types/pages/definedField'
import { findSelectOptionOrDefault } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a definedField
function DefinedFieldInfo() {
  const navigate = useNavigate()
  // Get the definedField ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IDefinedFieldFormData>({
    FieldNo: '',
    FieldName: '',
    FieldEnable: null,
    ListEnable: null,
    FilterEnable: null,
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the DefinedField from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IDefinedFieldResult>>(
    isDeleted || !queryId ? null : definedFieldApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { FieldNo, FieldName, FieldEnable, ListEnable, FilterEnable } = data.data
      setFormData({
        FieldNo: FieldNo.toString(),
        FieldName,
        FieldEnable: findSelectOptionOrDefault(booleanSelectOption, FieldEnable),
        ListEnable: findSelectOptionOrDefault(booleanSelectOption, ListEnable),
        FilterEnable: findSelectOptionOrDefault(booleanSelectOption, FilterEnable),
      })
    }
  }, [data])

  // Define the mutation function to delete the definedField from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    definedFieldApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to definedField list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.definedField.path(), { replace: true })
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeleted(false)
      },
    }
  )
  // Define the function to call delete mutation with Alert Dialog
  const handleDelete = () => {
    const deleteMutation = () => {
      setIsDeleted(true)
      return deleteTrigger()
    }
    openAlertDialogWithPromise(deleteMutation, { success: t`Success` }, t`Do you want to Delete ?`)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.definedFieldEdit.path(queryId),
    },
    {
      color: 'danger',
      icon: deleteIcon,
      text: t`Delete`,
      onClick: handleDelete,
      isLoading: deleteIsLoading,
    },
    {
      color: 'danger',
      icon: listIcon,
      text: t`List`,
      link: routeProperty.definedField.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <DefinedFieldForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default DefinedFieldInfo
