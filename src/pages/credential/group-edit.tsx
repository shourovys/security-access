import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { credentialApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import CredentialAccessForm from '../../components/pages/credential/form/CredentialAccessForm'
import CredentialGroupForm from '../../components/pages/credential/form/CredentialGroupForm'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange, THandleInputSelect } from '../../types/components/common'
import {
  INewFormErrors,
  ISelectedInputFields,
  ISingleServerResponse,
  accessSelectOption,
  booleanSelectOption,
} from '../../types/pages/common'
import {
  ICredentialGroupEditFormData,
  ICredentialResult,
  credentialStatsOptions,
  credentialTypesOptions,
} from '../../types/pages/credential'
import { findSelectOption } from '../../utils/findSelectOption'
import { htmlInputDatetimeFormatter } from '../../utils/formetTime'
import { applyIcon, cancelIcon } from '../../utils/icons'
import { groupEditSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to edit a Credential
function GroupEditCredential() {
  const navigate = useNavigate()
  // Get the credential IDs from the router query
  const [searchParams] = useSearchParams()
  const queryIds: string[] = searchParams.get('ids')?.split(',') || ['']

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<ICredentialGroupEditFormData>({
    // Format: null,
    // CredentialNumb: '',
    // SubKeyNumb: '',
    CredentialType: null,
    CredentialStat: null,
    NeverExpired: null,
    StartTime: '',
    EndTime: '',
    CredentialAccessSelect: null,
    CredentialGroupIds: [],
    CredentialAccessIds: [],
  })
  const [formErrors, setFormErrors] = useState<INewFormErrors<ICredentialGroupEditFormData>>({})

  // state for track if an input field is selected
  const [selectedInputFields, setSelectedInputFields] = useState<
    ISelectedInputFields<ICredentialGroupEditFormData>
  >({})

  // Fetch the details of the Credential from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ICredentialResult>>(
    queryIds[0] ? credentialApi.details(queryIds[0]) : null
  )

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const {
        // Format,
        // CredentialNumb,
        // SubKeyNumb,
        CredentialType,
        CredentialStat,
        NeverExpired,
        StartTime,
        EndTime,
        AccessSelect,
        Accesses,
        Groups,
      } = data.data

      setFormData({
        // Format: {
        //   value: Format.FormatNo.toString(),
        //   label: Format.FormatName,
        // },
        CredentialAccessSelect: findSelectOption(accessSelectOption, AccessSelect),
        CredentialGroupIds: Groups?.map((item) => item.GroupNo.toString()) || [],
        CredentialAccessIds: Accesses?.map((item) => item.AccessNo.toString()) || [],
        // CredentialNumb: CredentialNumb.toString(),
        // SubKeyNumb: SubKeyNumb.toString(),
        CredentialType: findSelectOption(credentialTypesOptions, CredentialType),
        CredentialStat: findSelectOption(credentialStatsOptions, CredentialStat),
        NeverExpired: findSelectOption(booleanSelectOption, NeverExpired),
        StartTime: htmlInputDatetimeFormatter(StartTime ?? '').toString(),
        EndTime: htmlInputDatetimeFormatter(EndTime ?? '').toString(),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Update the selected input fields when any input is selected
  const handleInputSelect: THandleInputSelect = (name, value) => {
    if (name === 'Credential') {
      setSelectedInputFields((state) => ({
        ...state,
        Format: value,
        CredentialNumb: value,
        // SubKeyNumb: value,
        CredentialType: value,
        CredentialStat: value,
        NeverExpired: value,
      }))
    } else {
      setSelectedInputFields((state) => ({ ...state, [name]: value }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(credentialApi.groupEdit, sendPostRequest, {
    onSuccess: () => {
      groupEditSuccessfulToast()
      // redirect to schedule list page on success
      navigate(routeProperty.credential.path())
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // const errors = validateCredentialGroupEditFormData(formData)

    // // If there are errors, display them and do not submit the form
    // if (Object.keys(errors).length) {
    //   setFormErrors(errors)
    //   //Object.entries(errors).forEach(([, value]) => {
    //   //   if (value) {
    //   //     errorToast(value)
    //   //   }
    //   // })
    //   return
    // }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      CredentialIds: queryIds,
      // ...(selectedInputFields.Format && {
      // FormatNo: Number(formData.Format?.value),
      // }),
      // ...(selectedInputFields.CredentialNumb && {
      // CredentialNumb: formData.CredentialNumb,
      // }),
      // ...(selectedInputFields.SubKeyNumb && {
      //   SubKeyNumb: formData.SubKeyNumb,
      // }),
      ...(selectedInputFields.CredentialType && {
        CredentialType: Number(formData.CredentialType?.value),
      }),
      ...(selectedInputFields.CredentialStat && {
        CredentialStat: Number(formData.CredentialStat?.value),
      }),
      ...(selectedInputFields.NeverExpired && {
        NeverExpired: Number(formData.NeverExpired?.value),
        StartTime: formData.StartTime,
        EndTime: formData.EndTime,
      }),
      ...(selectedInputFields.CredentialAccessSelect && {
        AccessSelect: Number(formData.CredentialAccessSelect?.value),
        GroupIds: formData.CredentialGroupIds,
        AccessIds: formData.CredentialAccessIds,
      }),
    }

    trigger(modifiedFormData)
  }

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
      link: routeProperty.credential.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors}>
        <CredentialGroupForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          selectedInputFields={selectedInputFields}
          handleSelect={handleInputSelect}
          isLoading={isLoading}
        />

        <CredentialAccessForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          isSelected={selectedInputFields.CredentialAccessSelect}
          handleSelect={handleInputSelect}
          isLoading={isLoading}
        />
      </FormContainer>

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
    </Page>
  )
}
export default GroupEditCredential
