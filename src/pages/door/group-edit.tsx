import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { doorApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import DoorGroupEditForm from '../../components/pages/door/form/DoorGroupEditForm'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange, THandleInputSelect } from '../../types/components/common'
import {
  IFormErrors,
  INewFormErrors,
  ISelectedInputFields,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../types/pages/common'
import { IDoorGroupEditFormData, IDoorResult } from '../../types/pages/door'
import { findSelectOption } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { groupEditSuccessfulToast } from '../../utils/toast'

import { booleanSelectOption } from '../../types/pages/common'
import {
  doorLockTypeOption,
  doorReaderTypeOption,
  doorRexAndContactTypeOption,
  doorThreatLevelOption,
} from '../../types/pages/door'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to edit a Door
function DoorGroupEdit() {
  const navigate = useNavigate()
  // Get the door IDs from the router query
  const [searchParams] = useSearchParams()
  const queryIds: string[] = searchParams.get('ids')?.split(',') || ['']

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IDoorGroupEditFormData>({
    Partition: null,
    InEnable: null,
    InType: null,
    OutEnable: null,
    OutType: null,
    ContactEnable: null,
    ContactType: null,
    ProppedTime: '',
    AdaTime: '',
    RexEnable: null,
    RexType: null,
    LockType: null,
    RelockOnOpen: null,
    UnlockTime: '',
    ExtendedUnlock: null,
    ExUnlockTime: '',
    Threat: null,
    ThreatLevel: null,
    ThreatIgnoreRex: null,
  })

  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // state for tracking if the door field is selected
  const [selectedInputFields, setSelectedInputFields] = useState<
    ISelectedInputFields<IDoorGroupEditFormData>
  >({})

  // Fetch the details of the Door from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IDoorResult>>(
    queryIds[0] ? doorApi.details(queryIds[0]) : null
  )

  useEffect(() => {
    if (data) {
      const {
        Partition,
        InEnable,
        InType,
        OutEnable,
        OutType,
        ContactEnable,
        ContactType,
        ProppedTime,
        AdaTime,
        RexEnable,
        RexType,
        LockType,
        RelockOnOpen,
        UnlockTime,
        ExtendedUnlock,
        ExUnlockTime,
        Threat,
        ThreatLevel,
        ThreatIgnoreRex,
      } = data.data

      setFormData({
        Partition: {
          label: Partition.PartitionName,
          value: Partition.PartitionNo.toString(),
        },
        InEnable: findSelectOption(booleanSelectOption, InEnable),
        InType: InType !== null ? findSelectOption(doorReaderTypeOption, InType) : null,
        OutEnable: findSelectOption(booleanSelectOption, OutEnable),
        OutType: OutType !== null ? findSelectOption(doorReaderTypeOption, OutType) : null,
        RexEnable: findSelectOption(booleanSelectOption, RexEnable),
        RexType: RexType !== null ? findSelectOption(doorRexAndContactTypeOption, RexType) : null,
        ContactEnable: findSelectOption(booleanSelectOption, ContactEnable),
        ContactType:
          ContactType !== null ? findSelectOption(doorRexAndContactTypeOption, ContactType) : null,
        ProppedTime: ProppedTime !== null ? ProppedTime.toString() : '',
        AdaTime: AdaTime !== null ? AdaTime.toString() : '',
        LockType: LockType !== null ? findSelectOption(doorLockTypeOption, LockType) : null,
        RelockOnOpen: findSelectOption(booleanSelectOption, RelockOnOpen),
        UnlockTime: UnlockTime !== null ? UnlockTime.toString() : '',
        ExtendedUnlock: findSelectOption(booleanSelectOption, ExtendedUnlock),
        ExUnlockTime: ExUnlockTime !== null ? ExUnlockTime.toString() : '',
        ThreatLevel:
          ThreatLevel !== null ? findSelectOption(doorThreatLevelOption, ThreatLevel) : null,
        ThreatIgnoreRex: findSelectOption(booleanSelectOption, ThreatIgnoreRex),
        Threat: Threat
          ? {
              label: Threat.ThreatName,
              value: Threat.ThreatNo.toString(),
            }
          : null,
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
    if (name === 'Door') {
      setSelectedInputFields((state) => ({
        ...state,
        Partition: value,
        InEnable: value,
        InType: value,
        OutEnable: value,
        OutType: value,
        ContactEnable: value,
        ContactType: value,
        ProppedTime: value,
        AdaTime: value,
        RexEnable: value,
        RexType: value,
        LockType: value,
        RelockOnOpen: value,
        UnlockTime: value,
        ExtendedUnlock: value,
        ExUnlockTime: value,
        ThreatNo: value,
        ThreatLevel: value,
        ThreatIgnoreRex: value,
      }))
    } else {
      setSelectedInputFields((state) => ({ ...state, [name]: value }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(doorApi.groupEdit, sendPostRequest, {
    onSuccess: () => {
      groupEditSuccessfulToast()
      navigate(routeProperty.door.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: INewFormErrors<IDoorGroupEditFormData> = {}

    if (selectedInputFields.Partition && !formData.Partition?.value) {
      errors.Partition = t`Partition is required`
    }

    if (selectedInputFields.InEnable && !formData.InEnable?.value) {
      errors.InEnable = t`In Enable is required`
    }

    if (selectedInputFields.InType && !formData.InType?.value) {
      errors.InType = t`In Type is required`
    }

    if (selectedInputFields.OutEnable && !formData.OutEnable?.value) {
      errors.OutEnable = t`Out Enable is required`
    }

    if (selectedInputFields.OutType && !formData.OutType?.value) {
      errors.OutType = t`Out Type is required`
    }

    if (selectedInputFields.ContactEnable && !formData.ContactEnable?.value) {
      errors.ContactEnable = t`Contact Enable is required`
    }

    if (selectedInputFields.ContactType && !formData.ContactType?.value) {
      errors.ContactType = t`Contact Type is required`
    }

    if (selectedInputFields.RexEnable && !formData.RexEnable?.value) {
      errors.RexEnable = t`Rex Enable is required`
    }

    if (selectedInputFields.RexType && !formData.RexType?.value) {
      errors.RexType = t`Rex Type is required`
    }

    if (selectedInputFields.LockType && !formData.LockType?.value) {
      errors.LockType = t`Lock Type is required`
    }

    if (selectedInputFields.RelockOnOpen && !formData.RelockOnOpen?.value) {
      errors.RelockOnOpen = t`Relock On Open is required`
    }

    if (selectedInputFields.ExtendedUnlock && !formData.ExtendedUnlock?.value) {
      errors.ExtendedUnlock = t`Extended Unlock is required`
    }

    if (selectedInputFields.ThreatLevel && !formData.ThreatLevel?.value) {
      errors.ThreatLevel = t`Threat Level is required`
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      DoorNos: queryIds,
      ...(selectedInputFields.Partition && {
        PartitionNo: Number(formData.Partition?.value),
      }),
      ...(selectedInputFields.InEnable && {
        InEnable: Number(formData.InEnable?.value),
      }),
      ...(selectedInputFields.InType && {
        InType: Number(formData.InType?.value),
      }),
      ...(selectedInputFields.OutEnable && {
        OutEnable: Number(formData.OutEnable?.value),
      }),
      ...(selectedInputFields.OutType && {
        OutType: Number(formData.OutType?.value),
      }),
      ...(selectedInputFields.ContactEnable && {
        ContactEnable: Number(formData.ContactEnable?.value),
      }),
      ...(selectedInputFields.ContactType && {
        ContactType: Number(formData.ContactType?.value),
      }),
      ...(selectedInputFields.ProppedTime && {
        ProppedTime: Number(formData.ProppedTime),
      }),
      ...(selectedInputFields.AdaTime && {
        AdaTime: Number(formData.AdaTime),
      }),
      ...(selectedInputFields.RexEnable && {
        RexEnable: Number(formData.RexEnable?.value),
      }),
      ...(selectedInputFields.RexType && {
        RexType: Number(formData.RexType?.value),
      }),
      ...(selectedInputFields.LockType && {
        LockType: Number(formData.LockType?.value),
      }),
      ...(selectedInputFields.RelockOnOpen && {
        RelockOnOpen: Number(formData.RelockOnOpen?.value),
      }),
      ...(selectedInputFields.UnlockTime && {
        UnlockTime: Number(formData.UnlockTime),
      }),
      ...(selectedInputFields.ExtendedUnlock && {
        ExtendedUnlock: Number(formData.ExtendedUnlock?.value),
      }),
      ...(selectedInputFields.ExUnlockTime && {
        ExUnlockTime: Number(formData.ExUnlockTime),
      }),
      ...(selectedInputFields.Threat && {
        ThreatNo: Number(formData.Threat?.value),
      }),
      ...(selectedInputFields.ThreatLevel && {
        ThreatLevel: Number(formData.ThreatLevel?.value),
      }),
      ...(selectedInputFields.ThreatIgnoreRex && {
        ThreatIgnoreRex: Number(formData.ThreatIgnoreRex?.value),
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
      link: routeProperty.door.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <DoorGroupEditForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          selectedFields={selectedInputFields}
          handleSelect={handleInputSelect}
          isLoading={isLoading}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.door.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default DoorGroupEdit
