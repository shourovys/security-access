import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { credentialApi, formatApi, partitionApi, personApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import CardModal from '../../components/HOC/modal/CardModal'
import Modal from '../../components/HOC/modal/Modal'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import CredentialScanModal from '../../components/pages/credential/CredentialScanModal/CredentialScanModal'
import { CredentialDeviceFrom } from '../../components/pages/credential/form'
import CredentialFrom from '../../components/pages/credential/form/CredentialFrom'
import {
  PersonAccessForm,
  PersonDefinedFieldForm,
  PersonOptionForm,
  PersonPersonalForm,
} from '../../components/pages/person/form'
import PersonListModal from '../../components/pages/person/form/PersonListModal/PersonListModal'
import { useDefaultPartitionOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IListServerResponse,
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  accessSelectOption,
  booleanSelectOption,
} from '../../types/pages/common'
import {
  ICredentialFormData,
  credentialStatsOptions,
  credentialTypesOptions,
} from '../../types/pages/credential'
import { IFormatResult } from '../../types/pages/format'
import { IPartitionResult } from '../../types/pages/partition'
import { IPersonResult, personThreatOptions } from '../../types/pages/person'
import { SERVER_QUERY } from '../../utils/config'
import { findSelectOption, findSelectOptionOrDefault } from '../../utils/findSelectOption'
import { addIcon, applyIcon, cancelIcon, personIcon, scanIcon, selectIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { addSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'
import validateCredentialFormData from '../../utils/validation/credential'

// Component to create a Credential
function CreateCredential() {
  const navigate = useNavigate()
  // Get the person ID from the router query
  const [searchParams] = useSearchParams()
  const queryPersonId = searchParams.get('personId')
  // Get the FormatNo, CardNumber from the router query
  const queryFormatNo: string | null = searchParams.get('FormatNo')
  // console.log('🚀 ~ file: add.tsx:63 ~ CreateCredential ~ queryFormatNo:', queryFormatNo)
  const queryCredentialNumber: string | null = searchParams.get('CardNumber')

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<ICredentialFormData>({
    Format: null,
    CredentialNumb: '',
    SubKeyNumb: '',
    CredentialType: credentialTypesOptions[0],
    CredentialStat: credentialStatsOptions[0],
    NeverExpired: booleanSelectOption[1],
    StartTime: '',
    EndTime: '',
    EventTime: '',
    CredentialAccessSelect: accessSelectOption[0],
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
  })
  // console.log('🚀 ~ file: add.tsx:119 ~ CreateCredential ~ formData:', formData.Format)
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<ICredentialFormData>>(
    {},
    scrollToErrorElement
  )
  // Set default Partition and Format
  useDefaultPartitionOption<ICredentialFormData>(setFormData)

  // Define state variables for modals view
  const [openSelectPersonList, setOpenSelectPersonList] = useState(false)
  const [openScanModal, setOpenScanModal] = useState(false)

  // Define state variables for current, sleeted person state
  const [PersonNo, setPersonNo] = useState('')

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Get format value from server for query format in state
  const { isLoading: formatIsLoading, data: formatData } = useSWR<
    IListServerResponse<IFormatResult[]>
  >(formatApi.list(SERVER_QUERY.selectorDataQuery))

  // if queryFormatNo, queryCredentialNumb is present add in state
  useEffect(() => {
    if (formatData && formatData.data.length > 0) {
      if (queryFormatNo) {
        const selectedFormat = formatData.data.find(
          (result) => result.FormatNo === Number(queryFormatNo)
        )
        if (selectedFormat) {
          handleInputChange('Format', {
            label: selectedFormat?.FormatName,
            value: selectedFormat?.FormatNo.toString(),
          })
        }
      } else {
        const defaultedFormat = formatData.data.find((result) => result.DefaultFormat)
        if (defaultedFormat) {
          handleInputChange('Format', {
            label: defaultedFormat.FormatName,
            value: defaultedFormat.FormatNo.toString(),
          })
        }
      }
    }
    if (queryCredentialNumber) {
      handleInputChange('CredentialNumb', queryCredentialNumber)
    }

    if (queryPersonId) {
      handleInputChange('PersonNo', queryPersonId)
      setPersonNo(queryPersonId)
    }
  }, [queryFormatNo, formatData, queryCredentialNumber, queryPersonId])

  // function for set person data in form data
  const setPersonInFormData = (person: IPersonResult) => {
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
    } = person
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
    }))
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
  const handleSelectedPerson = (person: IPersonResult) => {
    if (person) {
      setPersonNo(person.PersonNo.toString())
      setOpenSelectPersonList(false)
      setPersonInFormData(person)
    }
  }

  // Fetch the details of the Person from the server if personId is present in query
  const { data: personData } = useSWR<ISingleServerResponse<IPersonResult>>(
    !queryPersonId ? null : personApi.details(queryPersonId)
  )
  useEffect(() => {
    if (personData) {
      setPersonInFormData(personData.data)
    }
  }, [personData])

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(credentialApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()

      if (queryPersonId) {
        // back to person info page
        navigate(routeProperty.personInfo.path(queryPersonId))
      } else {
        // redirect to credential list page on success
        navigate(routeProperty.credential.path())
      }
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    const errors = validateCredentialFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      // error_toast
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

      ...(!queryPersonId && {
        // if query person id is not present
        CredentialPerson: {
          ...(PersonNo && {
            PersonNo,
          }),

          // person field data
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
      }),
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
        //Remove new New Person --rubel
        // {
        //   color: 'danger',
        //   icon: addIcon,
        //   text: t`New Person`,
        //   onClick: removePersonData,
        // },
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
        ? routeProperty.personInfo.path(queryPersonId)
        : routeProperty.credential.path(),
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
                { href: routeProperty.person.path(), text: t`Person` },
                {
                  href: routeProperty.personInfo.path(queryPersonId),
                  text: t`Information`,
                },
                {
                  href: routeProperty.credential.path(),
                  text: t`Credential`,
                },
                {
                  href: routeProperty.personCredentialCreate.path(),
                  text: t`Add`,
                },
              ]
            : [
                {
                  href: routeProperty.credential.path(),
                  text: t`Credential`,
                },
                {
                  href: routeProperty.credentialCreate.path(),
                  text: t`Add`,
                },
              ]
        }
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} sameHeight>
        <CredentialFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          queryFormatIsLoading={formatIsLoading}
        />

        <CredentialDeviceFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      {!queryPersonId && (
        <>
          <div className="pt-6 md:pt-8" />
          <FormContainer>
            <PersonPersonalForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
            />

            <PersonDefinedFieldForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
            />

            <PersonOptionForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
            />

            <PersonAccessForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
            />
          </FormContainer>
        </>
      )}
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.credential.path()}>
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

export default CreateCredential
