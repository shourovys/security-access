import { sendPostRequest } from '../../api/swrConfig'
import { personApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import { PersonAccessForm } from '../../components/pages/person/form'
import PersonPersonalGroupEditForm from '../../components/pages/person/form/PersonPersonalGroupEditForm'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useSearchParams } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
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
  IPersonFormData,
  IPersonGroupEditFormData,
  IPersonResult,
  personThreatOptions,
} from '../../types/pages/person'
import { findSelectOption, findSelectOptionOrDefault } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import { editSuccessfulToast, groupEditSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to edit a Person
function GroupEditPerson() {
  const navigate = useNavigate()
  // Get the person IDs from the router query
  const [searchParams] = useSearchParams()
  const queryIds: string[] = searchParams.get('ids')?.split(',') || ['']

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IPersonGroupEditFormData>({
    Partition: null,
    Ada: null,
    Exempt: null,
    Invite: null,
    ThreatLevel: null,
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
  const [formErrors, setFormErrors] = useState<INewFormErrors<IPersonFormData>>({})

  // state for track is input field is select
  const [selectedInputFields, setSelectedInputFields] = useState<
    ISelectedInputFields<IPersonFormData>
  >({})

  // Fetch the details of the Person from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IPersonResult>>(
    queryIds[0] ? personApi.details(queryIds[0]) : null
  )

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const {
        Partition,
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
      } = data.data

      setFormData({
        Partition: {
          label: Partition.PartitionName,
          value: Partition.PartitionNo.toString(),
        },
        Ada: findSelectOptionOrDefault(booleanSelectOption, Ada),
        Exempt: findSelectOptionOrDefault(booleanSelectOption, Exempt),
        Invite: findSelectOptionOrDefault(booleanSelectOption, Invite),
        ThreatLevel: findSelectOption(personThreatOptions, ThreatLevel),
        AccessSelect: findSelectOptionOrDefault(accessSelectOption, AccessSelect),
        AccessIds: Accesses?.map((_access) => _access.AccessNo.toString()) || [],
        GroupIds: Groups?.map((_group) => _group.GroupNo.toString()) || [],
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

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Update the selected input fields when any input selected
  const handleInputSelect: THandleInputSelect = (name, value) => {
    if (name === 'Person') {
      setSelectedInputFields((state) => ({
        ...state,
        Partition: value,
        ThreatLevel: value,
        Ada: value,
        Invite: value,
        Exempt: value,
        Field1: value,
        Field2: value,
        Field3: value,
        Field4: value,
        Field5: value,
        Field6: value,
        Field7: value,
        Field8: value,
        Field9: value,
        Field10: value,
        Field11: value,
        Field12: value,
        Field13: value,
        Field14: value,
        Field15: value,
        Field16: value,
        Field17: value,
        Field18: value,
        Field19: value,
        Field20: value,
      }))
    } else {
      setSelectedInputFields((state) => ({ ...state, [name]: value }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(personApi.groupEdit, sendPostRequest, {
    onSuccess: () => {
      groupEditSuccessfulToast()
      // redirect to schedule list page on success
      navigate(routeProperty.person.path())
    },
  })

  // Handle the form submission

  const handleSubmit = async () => {
    // const errors = validatePersonFormData(formData)

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
      PersonIds: queryIds,
      ...(selectedInputFields.Partition && {
        PartitionNo: formData.Partition?.value,
      }),
      ...(selectedInputFields.Ada && {
        Ada: Number(formData.Ada?.value),
      }),
      ...(selectedInputFields.Exempt && {
        Exempt: Number(formData.Exempt?.value),
      }),
      ...(selectedInputFields.Invite && {
        Invite: Number(formData.Invite?.value),
      }),
      ...(selectedInputFields.ThreatLevel && {
        ThreatLevel: Number(formData.ThreatLevel?.value),
      }),

      ...(selectedInputFields.AccessSelect && {
        AccessSelect: Number(formData.AccessSelect?.value),
        AccessIds: formData.AccessIds,
        GroupIds: formData.GroupIds,
      }),
      ...(selectedInputFields.Field1 && { Field1: formData.Field1 }),
      ...(selectedInputFields.Field2 && { Field2: formData.Field2 }),
      ...(selectedInputFields.Field3 && { Field3: formData.Field3 }),
      ...(selectedInputFields.Field4 && { Field4: formData.Field4 }),
      ...(selectedInputFields.Field5 && { Field5: formData.Field5 }),
      ...(selectedInputFields.Field6 && { Field6: formData.Field6 }),
      ...(selectedInputFields.Field7 && { Field7: formData.Field7 }),
      ...(selectedInputFields.Field8 && { Field8: formData.Field8 }),
      ...(selectedInputFields.Field9 && { Field9: formData.Field9 }),
      ...(selectedInputFields.Field10 && { Field10: formData.Field10 }),
      ...(selectedInputFields.Field11 && { Field11: formData.Field11 }),
      ...(selectedInputFields.Field12 && { Field12: formData.Field12 }),
      ...(selectedInputFields.Field13 && { Field13: formData.Field13 }),
      ...(selectedInputFields.Field14 && { Field14: formData.Field14 }),
      ...(selectedInputFields.Field15 && { Field15: formData.Field15 }),
      ...(selectedInputFields.Field16 && { Field16: formData.Field16 }),
      ...(selectedInputFields.Field17 && { Field17: formData.Field17 }),
      ...(selectedInputFields.Field18 && { Field18: formData.Field18 }),
      ...(selectedInputFields.Field19 && { Field19: formData.Field19 }),
      ...(selectedInputFields.Field20 && { Field20: formData.Field20 }),
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
      link: routeProperty.person.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors}>
        <PersonPersonalGroupEditForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          selectedInputFields={selectedInputFields}
          handleSelect={handleInputSelect}
          isLoading={isLoading}
        />

        <PersonAccessForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          isSelected={selectedInputFields.AccessSelect}
          handleSelect={handleInputSelect}
          isLoading={isLoading}
        />
      </FormContainer>

      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.person.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}
export default GroupEditPerson
