import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { credentialApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import { CredentialDeviceFrom } from '../../../components/pages/credential/form'
import CredentialCredentialFrom from '../../../components/pages/credential/form/CredentialFrom'
import {
  PersonAccessForm,
  PersonDefinedFieldForm,
  PersonOptionForm,
  PersonPersonalForm,
} from '../../../components/pages/person/form'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import {
  ISingleServerResponse,
  accessSelectOption,
  booleanSelectOption,
} from '../../../types/pages/common'
import {
  // add  credentialStatsOptions for show accurate data --rubel,
  ICredentialFormData,
  ICredentialResult,
  credentialStatsOptions,
  credentialTypesOptions,
} from '../../../types/pages/credential'
import { personThreatOptions } from '../../../types/pages/person'
import { findSelectOption, findSelectOptionOrDefault } from '../../../utils/findSelectOption'
import { htmlInputDatetimeFormatter } from '../../../utils/formetTime'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a credential
function CredentialInfo() {
  const navigate = useNavigate()
  // Get the credential ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // Get the person ID from the router query
  const [searchParams] = useSearchParams()
  const queryPersonId = searchParams.get('personId')
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<ICredentialFormData>({
    Format: null,
    CredentialNumb: '',
    SubKeyNumb: '',
    CredentialType: null,
    CredentialStat: null,
    NeverExpired: null,
    StartTime: '',
    EndTime: '',
    EventTime: '',
    CredentialAccessSelect: null,
    CredentialGroupIds: [],
    CredentialAccessIds: [],

    // person state
    Partition: null,
    LastName: '',
    FirstName: '',
    MiddleName: '',
    Email: '',
    ImageFile: '',
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

  // Fetch the details of the credential from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ICredentialResult>>(
    isDeleted || !queryId ? null : credentialApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      const {
        Format,
        AccessSelect,
        Accesses,
        Groups,
        CredentialNumb,
        SubKeyNumb,
        CredentialType,
        CredentialStat,
        NeverExpired,
        StartTime,
        EndTime,
        EventTime,
        // person data
        Person,
      } = data.data

      setFormData({
        Format: {
          value: Format.FormatNo.toString(),
          label: Format.FormatName,
        },
        CredentialAccessSelect: findSelectOption(accessSelectOption, AccessSelect),
        CredentialGroupIds: Groups?.map((item) => item.GroupNo.toString()) || [],
        CredentialAccessIds: Accesses?.map((item) => item.AccessNo.toString()) || [],
        CredentialGroups: Groups || [],
        CredentialAccesses: Accesses || [],
        CredentialNumb: CredentialNumb.toString(),
        SubKeyNumb: SubKeyNumb.toString(),
        //modify // add  credentialStatsOptions for show accurate data --rubel,
        CredentialType: findSelectOption(credentialTypesOptions, CredentialType),
        CredentialStat: findSelectOption(credentialStatsOptions, CredentialStat),
        NeverExpired: findSelectOption(booleanSelectOption, NeverExpired),
        StartTime: htmlInputDatetimeFormatter(StartTime ?? '').toString(),
        EndTime: htmlInputDatetimeFormatter(EndTime ?? '').toString(),
        EventTime: htmlInputDatetimeFormatter(EventTime).toString(),

        // person data
        Partition: Person?.Partition
          ? {
              label: Person?.Partition.PartitionName,
              value: Person?.Partition.PartitionNo.toString(),
            }
          : null,
        FirstName: Person?.FirstName || '',
        MiddleName: Person?.MiddleName || '',
        LastName: Person?.LastName || '',
        Email: Person?.Email || '',
        ImageFile: Person?.ImageFile || '',
        Ada: findSelectOptionOrDefault(booleanSelectOption, Person?.Ada || 0),
        Exempt: findSelectOptionOrDefault(booleanSelectOption, Person?.Exempt || 0),
        Invite: findSelectOptionOrDefault(booleanSelectOption, Person?.Invite || 0),
        ThreatLevel: findSelectOption(personThreatOptions, Person?.ThreatLevel || 0),
        AccessSelect: findSelectOptionOrDefault(accessSelectOption, Person?.AccessSelect || 0),
        AccessIds: Person?.Accesses?.map((item) => item.AccessNo.toString()) || [],
        GroupIds: Person?.Groups?.map((item) => item.GroupNo.toString()) || [],
        Groups: Person?.Groups || [],
        Accesses: Person?.Accesses || [],
        Field1: Person?.Field1 || '',
        Field2: Person?.Field2 || '',
        Field3: Person?.Field3 || '',
        Field4: Person?.Field4 || '',
        Field5: Person?.Field5 || '',
        Field6: Person?.Field6 || '',
        Field7: Person?.Field7 || '',
        Field8: Person?.Field8 || '',
        Field9: Person?.Field9 || '',
        Field10: Person?.Field10 || '',
        Field11: Person?.Field11 || '',
        Field12: Person?.Field12 || '',
        Field13: Person?.Field13 || '',
        Field14: Person?.Field14 || '',
        Field15: Person?.Field15 || '',
        Field16: Person?.Field16 || '',
        Field17: Person?.Field17 || '',
        Field18: Person?.Field18 || '',
        Field19: Person?.Field19 || '',
        Field20: Person?.Field20 || '',
      })
    }
  }, [data])

  // Define the mutation function to delete the credential from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    credentialApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to credential list page on successful delete
      onSuccess: () => {
        if (queryPersonId) {
          // back to person info page
          navigate(routeProperty.personInfo.path(queryPersonId))
        } else {
          // redirect to credential list page on success
          navigate(routeProperty.credential.path(), { replace: true })
        }
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
      // link: queryPersonId ? routeProperty.credentialEdit.path(queryId, queryPersonId) : routeProperty.credentialEdit.path(queryId),
      link: queryPersonId
        ? routeProperty.personCredentialEdit.path(queryId, queryPersonId)
        : routeProperty.credentialEdit.path(queryId),
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
      link: queryPersonId
        ? routeProperty.personInfo.path(queryPersonId)
        : routeProperty.credential.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={
          queryPersonId
            ? [
                { href: routeProperty.person.path(), text: t`Person` },
                {
                  href: routeProperty.personInfo.path(queryPersonId),
                  text: t`Information`,
                },
                {
                  // href: routeProperty.credentialInfo.path(queryId, queryPersonId),
                  href: routeProperty.personCredentialInfo.path(queryId, queryPersonId),
                  text: t`Credential Information`,
                },
              ]
            : [
                {
                  href: routeProperty.credential.path(),
                  text: t`Credential`,
                },
                {
                  href: routeProperty.credentialInfo.path(queryId),
                  text: t`Information`,
                },
              ]
        }
      />
      <div className="pt-2" />
      <FormContainer sameHeight>
        <CredentialCredentialFrom formData={formData} isLoading={isLoading} />

        <CredentialDeviceFrom formData={formData} isLoading={isLoading} />
      </FormContainer>
      <div className="pt-6 md:pt-8" />
      {!queryPersonId && (
        <>
          <FormContainer>
            <PersonPersonalForm formData={formData} isLoading={isLoading} />

            <PersonDefinedFieldForm formData={formData} isLoading={isLoading} />

            <PersonOptionForm formData={formData} isLoading={isLoading} />

            <PersonAccessForm formData={formData} isLoading={isLoading} />
          </FormContainer>
        </>
      )}
    </Page>
  )
}

export default CredentialInfo
