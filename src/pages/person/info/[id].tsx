import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { personApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import {
  PersonAccessForm,
  PersonDefinedFieldForm,
  PersonOptionForm,
  PersonPersonalForm,
} from '../../../components/pages/person/form'
import PersonCredentialList from '../../../components/pages/person/form/PersonCredentialList'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import {
  ISingleServerResponse,
  accessSelectOption,
  booleanSelectOption,
} from '../../../types/pages/common'
import {
  IPersonInfoFormData,
  IPersonResult,
  personThreatOptions,
} from '../../../types/pages/person'
import { findSelectOption, findSelectOptionOrDefault } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a person
function PersonInfo() {
  const navigate = useNavigate()
  // Get the person ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IPersonInfoFormData>({
    Partition: null,
    LastName: '',
    FirstName: '',
    MiddleName: '',
    Email: '',
    ImageFile: '',
    Credentials: [],
    Ada: null,
    Exempt: null,
    Invite: null,
    ThreatLevel: null,
    AccessSelect: null,
    AccessIds: [],
    GroupIds: [],
    Accesses: [],
    Groups: [],
    Field1: '',
    Field2: '',
    Field3: '',
    Field4: '',
    Field5: '',
    Field6: '',
    Field7: '',
    Field8: '',
    Field9: '',
    Field10: '',
    Field11: '',
    Field12: '',
    Field13: '',
    Field14: '',
    Field15: '',
    Field16: '',
    Field17: '',
    Field18: '',
    Field19: '',
    Field20: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Person from the server
  const { isLoading, data, mutate } = useSWR<ISingleServerResponse<IPersonResult>>(
    isDeleted || !queryId ? null : personApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      const {
        Partition,
        FirstName,
        MiddleName,
        LastName,
        Email,
        ImageFile,
        Ada,
        Exempt,
        Invite,
        Credentials,
        ThreatLevel,
        AccessSelect,
        Accesses,
        Groups,
        Field1,
        Field2,
        Field3,
        Field4,
        Field5,
        Field6,
        Field7,
        Field8,
        Field9,
        Field10,
        Field11,
        Field12,
        Field13,
        Field14,
        Field15,
        Field16,
        Field17,
        Field18,
        Field19,
        Field20,
      } = data.data

      setFormData({
        Partition: {
          label: Partition.PartitionName,
          value: Partition.PartitionNo.toString(),
        },
        FirstName: FirstName || '',
        MiddleName: MiddleName || '',
        LastName: LastName || '',
        Email: Email || '',
        ImageFile: ImageFile || '',
        Credentials,
        Ada: findSelectOptionOrDefault(booleanSelectOption, Ada),
        Exempt: findSelectOptionOrDefault(booleanSelectOption, Exempt),
        Invite: findSelectOptionOrDefault(booleanSelectOption, Invite),
        ThreatLevel: findSelectOption(personThreatOptions, ThreatLevel),
        AccessSelect: findSelectOptionOrDefault(accessSelectOption, AccessSelect),
        AccessIds: [],
        GroupIds: [],
        Groups: Groups || [],
        Accesses: Accesses || [],
        Field1: Field1 || '',
        Field2: Field2 || '',
        Field3: Field3 || '',
        Field4: Field4 || '',
        Field5: Field5 || '',
        Field6: Field6 || '',
        Field7: Field7 || '',
        Field8: Field8 || '',
        Field9: Field9 || '',
        Field10: Field10 || '',
        Field11: Field11 || '',
        Field12: Field12 || '',
        Field13: Field13 || '',
        Field14: Field14 || '',
        Field15: Field15 || '',
        Field16: Field16 || '',
        Field17: Field17 || '',
        Field18: Field18 || '',
        Field19: Field19 || '',
        Field20: Field20 || '',
      })
    }
  }, [data])

  // Define the mutation function to delete the person from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    personApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to person list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.person.path(), { replace: true })
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
    //persons/<int:pk>/details/
    const res = await fetch(`${import.meta.env.VITE_API_URL}/persons/persons/${queryId}/details/`, {
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
                <p>If you Delete this, the followings also:</p>
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
  const breadcrumbsActions: IActionsButton[] =
    queryId === '0'
      ? [
          {
            color: 'danger',
            icon: editIcon,
            text: t`Edit`,
            link: routeProperty.personEdit.path(queryId),
          },
          {
            color: 'danger',
            icon: listIcon,
            text: t`List`,
            link: routeProperty.person.path(),
          },
        ]
      : [
          {
            color: 'danger',
            icon: editIcon,
            text: t`Edit`,
            link: routeProperty.personEdit.path(queryId),
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
            link: routeProperty.person.path(),
          },
        ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer>
        <PersonPersonalForm formData={formData} isLoading={isLoading} />

        <PersonDefinedFieldForm formData={formData} isLoading={isLoading} />

        <PersonOptionForm formData={formData} isLoading={isLoading} />

        <PersonAccessForm formData={formData} isLoading={isLoading} />
      </FormContainer>

      <div className="pt-4" />
      <FormContainer twoPart={false}>
        <PersonCredentialList
          parsonCredentials={formData.Credentials}
          isLoading={isLoading}
          refetchPersonDetails={mutate}
          email={formData.Email}
        />
      </FormContainer>
    </Page>
  )
}

export default PersonInfo
