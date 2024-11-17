import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { userRoleApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import UserRoleAuthorizationForm from '../../../components/pages/userrole/form/UserRoleAuthorizationForm'
import UserRoleForm from '../../../components/pages/userrole/form/UserRoleForm'
import useAlert from '../../../hooks/useAlert'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IUserRoleInfoFormData, IUserRoleResult } from '../../../types/pages/userRole'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import pagesLicenseFilter from '../../../utils/pagesLicenseFilter'
import t from '../../../utils/translator'

// Component to show details of a userRole
function UserRoleInfo() {
  const { has_license, license } = useAuth()
  const navigate = useNavigate()
  // Get the userRole ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IUserRoleInfoFormData>({
    RoleNo: 1,
    RoleName: '',
    RoleDesc: '',
    Partition: null,
    PageIds: [],
    Pages: [],
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the UserRole from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IUserRoleResult>>(
    isDeleted || !queryId ? null : userRoleApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { RoleNo, RoleName, RoleDesc, Partition, Pages } = data.data

      const filteredPages = pagesLicenseFilter(Pages, license, has_license)

      setFormData({
        RoleNo,
        RoleName,
        RoleDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        PageIds: Pages.map((page) => page.PageNo.toString()),
        Pages: filteredPages,
      })
    }
  }, [data])

  // Define the mutation function to delete the userRole from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    userRoleApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to userRole list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.userRole.path(), { replace: true })
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeleted(false)
      },
    }
  )

  const token = sessionStorage.getItem('accessToken')

  // Define the function to call delete mutation with Alert Dialog
  const handleDelete = async () => {
    const deleteMutation = () => {
      setIsDeleted(true)
      return deleteTrigger()
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/roles/${queryId}/details/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    // console.log(data, '------');

    const messages = []

    let isNoRelatedEntities = false

    for (const key in data) {
      if (data[key] === 'No related entities.') {
        isNoRelatedEntities = true
        break
      } else if (data[key] !== undefined && data[key] !== 0) {
        messages.push(`${data[key]}`)
      }
    }

    let myMessage
    if (isNoRelatedEntities) {
      myMessage = (
        <div>
          <p>Do you want to Delete?</p>
        </div>
      )
    } else {
      const tableRows = messages.map((message, index) => (
        <tr key={index}>
          <td>{message}</td>
        </tr>
      ))

      myMessage = (
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-lg">If you Delete this, the followings also:</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
            <tfoot>
              <tr>
                <td className="">Do you want to Delete?</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )
    }

    openAlertDialogWithPromise(deleteMutation, { success: t`Success` }, myMessage as any)
  }

  // Define the actions for the breadcrumbs bar
  let breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.userRoleEdit.path(queryId),
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
      link: routeProperty.userRole.path(),
    },
  ]

  if (queryId === '0') {
    breadcrumbsActions = breadcrumbsActions.filter((action) => action.text !== 'Delete')
  }

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <UserRoleForm formData={formData} isLoading={isLoading} />
        <UserRoleAuthorizationForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default UserRoleInfo
