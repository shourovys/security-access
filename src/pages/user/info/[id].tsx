import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { userApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import UserForm from '../../../components/pages/user/form/UserForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IUserFormData, IUserResult } from '../../../types/pages/user'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a user
function UserInfo() {
  const navigate = useNavigate()
  // Get the user ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IUserFormData>({
    UserNo: '',
    UserId: '',
    Password: '',
    UserDesc: '',
    Email: '',
    Partition: null,
    Role: null,
    Person: null,
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the User from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IUserResult>>(
    isDeleted || !queryId ? null : userApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      const { UserNo, UserId, UserDesc, Email, Role, Person, Partition } = data.data

      setFormData({
        UserNo: UserNo.toString(),
        UserId,
        Password: '',
        UserDesc,
        Email,
        Role: Role?.RoleName
          ? {
              value: Role.RoleNo.toString(),
              label: Role.RoleName,
            }
          : null,
        Person: Person?.LastName
          ? {
              value: Person.PersonNo.toString(),
              label: Person.LastName,
            }
          : null,
        Partition: Partition.PartitionName
          ? {
              value: Partition.PartitionNo.toString(),
              label: Partition.PartitionName,
            }
          : null,
      })
    }
  }, [data])

  // Define the mutation function to delete the user from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    userApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to user list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.user.path(), { replace: true })
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
  const breadcrumbsActions: IActionsButton[] =
    queryId === '0'
      ? [
          {
            color: 'danger',
            icon: editIcon,
            text: t`Edit`,
            link: routeProperty.userEdit.path(queryId),
          },
          {
            color: 'danger',
            icon: listIcon,
            text: t`List`,
            link: routeProperty.user.path(),
          },
        ]
      : [
          {
            color: 'danger',
            icon: editIcon,
            text: t`Edit`,
            link: routeProperty.userEdit.path(queryId),
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
            link: routeProperty.user.path(),
          },
        ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <UserForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default UserInfo
