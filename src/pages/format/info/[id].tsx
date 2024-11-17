import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { formatApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import {
  FormatFacilityNumberForm,
  FormatParity1Form,
  FormatParity2Form,
} from '../../../components/pages/format/form'
import FormatForm from '../../../components/pages/format/form/FormatForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../../types/pages/common'
import {
  IFormatFormData,
  IFormatResult,
  formatTypeOptions,
  parityOptions,
} from '../../../types/pages/format'
import { findSelectOption, findSelectOptionOrDefault } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a format
function FormatInfo() {
  const navigate = useNavigate()
  // Get the format ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IFormatFormData>({
    FormatName: '',
    FormatDesc: '',
    DefaultFormat: null,
    FormatType: null,
    BigEndian: null,
    NapcoFormat: null,
    TotalLength: '',
    FacilityCode: '',
    FacilityStart: '',
    FacilityLength: '',
    NumberStart: '',
    NumberLength: '',
    Parity1Type: null,
    Parity1Position: '',
    Parity1Start: '',
    Parity1Length: '',
    Parity2Type: null,
    Parity2Position: '',
    Parity2Start: '',
    Parity2Length: '',
    CardData: '',
    CardNumber: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Format from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IFormatResult>>(
    isDeleted || !queryId ? null : formatApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        FormatName,
        FormatDesc,
        DefaultFormat,
        BigEndian,
        NapcoFormat,
        FormatType,
        TotalLength,
        FacilityCode,
        FacilityStart,
        FacilityLength,
        NumberStart,
        NumberLength,
        Parity1Type,
        Parity1Position,
        Parity1Start,
        Parity1Length,
        Parity2Type,
        Parity2Position,
        Parity2Start,
        Parity2Length,
      } = data.data

      setFormData({
        FormatName,
        FormatDesc: FormatDesc ?? '',
        DefaultFormat: findSelectOption(formatTypeOptions, DefaultFormat),
        BigEndian: findSelectOptionOrDefault(booleanSelectOption, BigEndian),
        NapcoFormat: findSelectOptionOrDefault(booleanSelectOption, NapcoFormat),
        FormatType:
          typeof FormatType === 'number' ? findSelectOption(formatTypeOptions, FormatType) : null,
        TotalLength: TotalLength?.toString() ?? '',
        FacilityCode: FacilityCode?.toString() ?? '',
        FacilityStart: FacilityStart?.toString() ?? '',
        FacilityLength: FacilityLength?.toString() ?? '',
        NumberStart: NumberStart?.toString() ?? '',
        NumberLength: NumberLength?.toString() ?? '',
        Parity1Type:
          typeof Parity1Type === 'number' ? findSelectOption(parityOptions, Parity1Type) : null,
        Parity1Position: Parity1Position?.toString() ?? '',
        Parity1Start: Parity1Start?.toString() ?? '',
        Parity1Length: Parity1Length?.toString() ?? '',
        Parity2Type:
          typeof Parity2Type === 'number' ? findSelectOption(parityOptions, Parity2Type) : null,
        Parity2Position: Parity2Position?.toString() ?? '',
        Parity2Start: Parity2Start?.toString() ?? '',
        Parity2Length: Parity2Length?.toString() ?? '',
        CardData: '',
        CardNumber: '',
      })
    }
  }, [data])

  // Define the mutation function to delete the format from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    formatApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to format list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.format.path(), { replace: true })
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeleted(false)
      },
    }
  )
  // Define the function to call delete mutation with Alert Dialog
  // const handleDelete = () => {
  //   const deleteMutation = () => {
  //     setIsDeleted(true)
  //     return deleteTrigger()
  //   }
  //   openAlertDialogWithPromise(deleteMutation, { success: t`Success` })
  // }

  const token = sessionStorage.getItem('accessToken')

  // Define the function to call delete mutation with Alert Dialog
  const handleDelete = async () => {
    const deleteMutation = () => {
      setIsDeleted(true)
      return deleteTrigger()
    }
    // formats/<int:pk>/details/
    const res = await fetch(`${import.meta.env.VITE_API_URL}/persons/formats/${queryId}/details/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    // console.log(data, '------');

    const messages = []

    let isNoRelatedEntities = false

    for (const key in data) {
      if (data[key] === '') {
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
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.formatEdit.path(queryId),
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
      link: routeProperty.format.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer sameHeight>
        <FormatForm formData={formData} isLoading={isLoading} />

        <FormatFacilityNumberForm formData={formData} isLoading={isLoading} />

        <FormatParity1Form formData={formData} isLoading={isLoading} />

        <FormatParity2Form formData={formData} isLoading={isLoading} />

        {/* <FormatScanDataForm
                        formData={formData}
                        isLoading={isLoading}
                    /> */}
      </FormContainer>
    </Page>
  )
}

export default FormatInfo
