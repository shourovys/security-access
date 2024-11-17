import { sendPutRequest } from '../../../api/swrConfig'
import { credentialApi, partitionApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import CardModal from '../../../components/HOC/modal/CardModal'
import Modal from '../../../components/HOC/modal/Modal'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import CredentialScanModal from '../../../components/pages/credential/CredentialScanModal/CredentialScanModal'
import { CredentialDeviceFrom } from '../../../components/pages/credential/form'
import CredentialCredentialFrom from '../../../components/pages/credential/form/CredentialFrom'
import {
  PersonAccessForm,
  PersonDefinedFieldForm,
  PersonOptionForm,
  PersonPersonalForm,
} from '../../../components/pages/person/form'
import PersonListModal from '../../../components/pages/person/form/PersonListModal/PersonListModal'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  IListServerResponse,
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  accessSelectOption,
  booleanSelectOption,
} from '../../../types/pages/common'
import {
  ICredentialFormData,
  ICredentialResult,
  credentialTypesOptions,
  credentialStatsOptions,
} from '../../../types/pages/credential'
import { IPartitionResult } from '../../../types/pages/partition'
import { IPersonResult, personThreatOptions } from '../../../types/pages/person'
import { SERVER_QUERY } from '../../../utils/config'
import { findSelectOption, findSelectOptionOrDefault } from '../../../utils/findSelectOption'
import {
  addIcon,
  applyIcon,
  cancelIcon,
  personIcon,
  scanIcon,
  selectIcon,
} from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../../utils/toast'
import validateCredentialFormData from '../../../utils/validation/credential'
import { htmlInputDatetimeFormatter } from '../../../utils/formetTime'
import t from '../../../utils/translator'

// Component to edit a Credential
function EditCredential() {
  const navigate = useNavigate()
  // Get the credential ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // Get the person ID from the router query
  const [searchParams] = useSearchParams()
  const queryPersonId = searchParams.get('personId')

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
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

    // person inputs
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
  console.log('🚀 ~ file: [id].tsx:120 ~ EditCredential ~ formData:', formData.AccessIds)
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<ICredentialFormData>>(
    {},
    scrollToErrorElement
  )

  // Define state variables for modals view
  const [openSelectPersonList, setOpenSelectPersonList] = useState(false)
  const [openScanModal, setOpenScanModal] = useState(false)

  // Define state variables for current, sleeted person state
  const [PersonNo, setPersonNo] = useState('')

  // Fetch the details of the Credential from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ICredentialResult>>(
    queryId ? credentialApi.details(queryId) : null
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

        CredentialNumb: CredentialNumb.toString(),
        SubKeyNumb: SubKeyNumb.toString(),
        CredentialType: findSelectOption(credentialTypesOptions, CredentialType),
        CredentialStat: findSelectOption(credentialStatsOptions, CredentialStat),
        NeverExpired: findSelectOption(booleanSelectOption, NeverExpired),
        StartTime: htmlInputDatetimeFormatter(StartTime),
        EndTime: htmlInputDatetimeFormatter(EndTime),
        EventTime: EventTime.toString(),

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
      setPersonNo(data?.data.PersonNo.toString())
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  const { data: partitionData } = useSWR<IListServerResponse<IPartitionResult[]>>(
    partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  // Update the form data when any input changes
  const removePersonData = () => {
    setPersonNo('')
    setFormData((state) => ({
      ...state,
      // person inputs
      ...(partitionData &&
        partitionData.data.length > 0 && {
          Partition: {
            label: partitionData.data[0].PartitionName,
            value: partitionData.data[0].PartitionNo.toString(),
          },
        }),
      LastName: '',
      FirstName: '',
      MiddleName: '',
      Email: '',
      ImageFile: '',
      Ada: null,
      Exempt: null,
      Invite: null,
      ThreatLevel: personThreatOptions[0],
      AccessSelect: accessSelectOption[0],
      AccessIds: [],
      GroupIds: [],
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
    }))
  }

  // Update the form person data with selected person
  const handleSelectedPerson = (_person: IPersonResult) => {
    if (_person) {
      setPersonNo(_person.PersonNo.toString())
      setOpenSelectPersonList(false)
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
      } = _person
      setFormData((prevState) => ({
        ...prevState,
        Partition: {
          label: Partition.PartitionName,
          value: Partition.PartitionNo.toString(),
        },
        FirstName: FirstName || '',
        MiddleName: MiddleName || '',
        LastName: LastName || '',
        Email: Email || '',
        ImageFile: ImageFile || '',
        Ada: findSelectOptionOrDefault(booleanSelectOption, Ada),
        Exempt: findSelectOptionOrDefault(booleanSelectOption, Exempt),
        Invite: findSelectOptionOrDefault(booleanSelectOption, Invite),
        ThreatLevel: findSelectOption(personThreatOptions, ThreatLevel),
        AccessSelect: findSelectOptionOrDefault(accessSelectOption, AccessSelect),
        AccessIds: Groups?.map((item) => item.GroupNo.toString()) || [],
        GroupIds: Accesses?.map((item) => item.AccessNo.toString()) || [],
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
      }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(credentialApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      queryPersonId // if person preset in query then navigate to that person info page
        ? navigate(routeProperty.personCredentialInfo.path(queryId, queryPersonId))
        : navigate(routeProperty.credentialInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateCredentialFormData(formData)

    if (Object.keys(errors).length) {
      setFormErrors(errors)
      //Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value)
      //   }
      // })
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      FormatNo: formData.Format?.value,
      CredentialNumb: formData.CredentialNumb,
      SubKeyNumb: formData.SubKeyNumb,
      CredentialType: formData.CredentialType?.value,
      CredentialStat: formData.CredentialStat?.value,
      NeverExpired: formData.NeverExpired?.value,
      StartTime: formData.StartTime,
      EndTime: formData.EndTime,
      AccessSelect: formData.CredentialAccessSelect?.value,
      ...(formData.CredentialAccessSelect?.label === 'Individual' && {
        AccessIds: formData.CredentialAccessIds,
        GroupIds: [],
      }),
      ...(formData.CredentialAccessSelect?.label === 'Group' && {
        AccessIds: [],
        GroupIds: formData.CredentialGroupIds,
      }),

      ...(PersonNo && {
        PersonNo,
      }),

      CredentialPerson: {
        // person data
        ...(PersonNo && {
          PersonNo,
        }),
        PartitionNo: formData.Partition?.value,
        LastName: formData.LastName,
        FirstName: formData.FirstName,
        MiddleName: formData.MiddleName,
        Email: formData.Email,
        ImageFile: formData.ImageFile,
        Ada: formData.Ada?.value,
        Exempt: formData.Exempt?.value,
        Invite: formData.Invite?.value,
        ThreatLevel: formData.ThreatLevel?.value,
        AccessSelect: formData.AccessSelect?.value,
        ...(formData.AccessSelect?.label === 'Individual' && {
          AccessIds: formData.AccessIds,
          GroupIds: [],
        }),
        ...(formData.AccessSelect?.label === 'Group' && {
          AccessIds: [],
          GroupIds: formData.GroupIds,
        }),
        Field1: formData.Field1 || '',
        Field2: formData.Field2 || '',
        Field3: formData.Field3 || '',
        Field4: formData.Field4 || '',
        Field5: formData.Field5 || '',
        Field6: formData.Field6 || '',
        Field7: formData.Field7 || '',
        Field8: formData.Field8 || '',
        Field9: formData.Field9 || '',
        Field10: formData.Field10 || '',
        Field11: formData.Field11 || '',
        Field12: formData.Field12 || '',
        Field13: formData.Field13 || '',
        Field14: formData.Field14 || '',
        Field15: formData.Field15 || '',
        Field16: formData.Field16 || '',
        Field17: formData.Field17 || '',
        Field18: formData.Field18 || '',
        Field19: formData.Field19 || '',
        Field20: formData.Field20 || '',
      },
    }

    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = queryPersonId // if person preset in query then hide all person select action
    ? [
        {
          color: 'danger',
          icon: scanIcon,
          text: t`Scan`,
          onClick: () => setOpenScanModal(true),
        },
      ]
    : [
        {
          color: 'danger',
          icon: addIcon,
          text: t`New Person`,
          onClick: removePersonData,
        },
        {
          color: 'danger',
          icon: selectIcon,
          text: t`Person Select`,
          onClick: () => setOpenSelectPersonList(true),
        },
        {
          color: 'danger',
          icon: scanIcon,
          text: t`Scan`,
          onClick: () => setOpenScanModal(true),
        },
      ]

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActionsButtons: IActionsButton[] = [
    {
      color: 'apply',
      icon: applyIcon,
      text: t`Apply`,
      onClick: handleSubmit,
      isLoading: isMutating,
    },
    {
      color: 'cancel',
      icon: cancelIcon,
      text: t`Cancel`,
      link: queryPersonId // if person preset in query then
        ? routeProperty.personCredentialInfo.path(queryId, queryPersonId)
        : routeProperty.credentialInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        pageRoutes={
          queryPersonId
            ? [
                {
                  href: routeProperty.person.path(),
                  text: t`Person`,
                },
                {
                  href: routeProperty.personInfo.path(queryPersonId),
                  text: t`Information`,
                },
                {
                  href: routeProperty.personCredentialInfo.path(queryId, queryPersonId), //modified by Imran
                  text: t`Credential`,
                },
                {
                  href: routeProperty.personCredentialEdit.path(queryId, queryPersonId), //modified by Imran
                  text: t`Edit`,
                },
              ]
            : [
                {
                  href: routeProperty.credential.path(),
                  text: t`Credential`,
                },
                {
                  href: routeProperty.credentialEdit.path(queryId),
                  text: t`Edit`,
                },
              ]
        }
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors}>
        <CredentialCredentialFrom
          formData={formData}
          isLoading={isLoading}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />

        <CredentialDeviceFrom
          formData={formData}
          isLoading={isLoading}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      {!queryPersonId && ( // if person preset in query then hide all person information
        <>
          <div className="pt-6 md:pt-8" />
          <FormContainer>
            <PersonPersonalForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />

            <PersonDefinedFieldForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />

            <PersonOptionForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />

            <PersonAccessForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
          </FormContainer>
        </>
      )}
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.credentialInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
      {/* person list modal  */}
      <CardModal
        icon={personIcon}
        headerTitle={t`Person Select`}
        openModal={openSelectPersonList}
        setOpenModal={setOpenSelectPersonList}
      >
        <PersonListModal selectedPersonId={PersonNo} handleSelectedPerson={handleSelectedPerson} />
      </CardModal>
      {/* credential scan modal  */}
      <Modal openModal={openScanModal} setOpenModal={setOpenScanModal}>
        <CredentialScanModal setCredentialFormData={setFormData} setOpenModal={setOpenScanModal} />
      </Modal>
    </Page>
  )
}

export default EditCredential
