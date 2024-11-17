import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { scheduleApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ScheduleForm from '../../../components/pages/schedule/form/ScheduleForm'
import ScheduleItemList from '../../../components/pages/schedule/scheduleItem/ScheduletemList'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IScheduleFormData, IScheduleResult } from '../../../types/pages/schedule'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a schedule
function ScheduleInfo() {
  const navigate = useNavigate()
  // Get the schedule ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IScheduleFormData>({
    ScheduleName: '',
    ScheduleDesc: '',
    Partition: null,
    Holiday: null,
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Schedule from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IScheduleResult>>(
    isDeleted || !queryId ? null : scheduleApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { ScheduleName, ScheduleDesc, Partition, Holiday } = data.data
      setFormData({
        ScheduleName,
        ScheduleDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Holiday: Holiday?.HolidayNo
          ? {
              value: Holiday.HolidayNo.toString(),
              label: Holiday.HolidayName,
            }
          : null,
      })
    }
  }, [data])

  // Define the mutation function to delete the schedule from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    scheduleApi.delete(queryId),
    sendDeleteRequest,
    {
      onSuccess: () => {
        navigate(routeProperty.schedule.path(), { replace: true })
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeleted(false)
      },
    }
  )

  // /works/schedules/${queryId}/details/

  // const token = sessionStorage.getItem('accessToken');

  // const handleDelete = async () => {
  //   const deleteMutation = () => {
  //     setIsDeleted(true)
  //     return deleteTrigger()
  //   }
  //   const res = await fetch(`${import.meta.env.VITE_API_URL}/works/schedules/${queryId}/details/`,{
  //     headers:{
  //       'Authorization': `Bearer ${token}`
  //     }
  //   });
  //   const   data = await res.json()
  //   const messages = []

  //     for (const key in data) {
  //       if (data[key] !== undefined && data[key] !== 0) {
  //         messages.push(`${data[key]}`)
  //       }
  //     }

  //     const tableRows = messages.map((message, index) => (
  //       <tr key={index}>
  //         <td>{message}</td>
  //       </tr>
  //     ));

  //   const myMessage = messages.length > 0 ? (
  //     <div>

  //     <table className="w-full border-collapse">
  //       <thead>
  //         <tr>
  //           <th className="text-lg">If you delete this, the followings also:</th>
  //         </tr>
  //       </thead>
  //       <tbody>{tableRows}</tbody>
  //       <tfoot>
  //         <tr>
  //           <td className="">Do you want to Delete?</td>
  //         </tr>
  //       </tfoot>
  //     </table>

  //     </div>
  //   ) : null;

  //   openAlertDialogWithPromise(deleteMutation, { success: t`Success` }, myMessage as any)
  // }
  const token = sessionStorage.getItem('accessToken')

  // Define the function to call delete mutation with Alert Dialog
  const handleDelete = async () => {
    const deleteMutation = () => {
      setIsDeleted(true)
      return deleteTrigger()
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/works/schedules/${queryId}/details/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    // console.log(data, '------');

    const messages = []

    let isNoRelatedEntities = false

    for (const key in data) {
      if (data[key] === '.') {
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

  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.scheduleEdit.path(queryId),
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
      link: routeProperty.schedule.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ScheduleForm formData={formData} isLoading={isLoading} />
      </FormContainer>
      <div className="pt-4" />
      <FormContainer twoPart={false}>
        <ScheduleItemList />
      </FormContainer>
    </Page>
  )
}

export default ScheduleInfo
