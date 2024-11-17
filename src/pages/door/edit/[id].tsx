import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPutRequest } from '../../../api/swrConfig'
import { doorApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../types/pages/common'
import { IDoorFormData, IDoorResult } from '../../../types/pages/door'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import validateDoorFormData from '../../../utils/validation/door'

import {
  DoorAlertForm,
  DoorAntiPassBackForm,
  DoorBuglarAlarmForm,
  DoorChannelForm,
  DoorContactForm,
  DoorForm,
  DoorLockForm,
  DoorOccupancySensorForm,
  DoorPairForm,
  DoorReaderForm,
  DoorRexForm,
  DoorShuntForm,
  DoorThreatLevelForm,
} from '../../../components/pages/door/form'
import { booleanSelectOption } from '../../../types/pages/common'
import {
  doorAntiPassTypeOption,
  doorLockTypeOption,
  doorReaderTypeOption,
  doorRexAndContactTypeOption,
  doorThreatLevelOption,
} from '../../../types/pages/door'
import { findSelectOption } from '../../../utils/findSelectOption'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'

// Component to edit a Door
function EditDoor() {
  const navigate = useNavigate()
  // Get the door ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IDoorFormData>({
    Partition: null,
    InRegion: null,
    OutRegion: null,
    Threat: null,
    PairDoor: null,
    Channel: null,
    ShuntOutput: null,
    BurgOutput: null,
    BurgInput: null,
    BurgZoneInput: null,
    OccupancyInput: null,
    DoorName: '',
    DoorDesc: '',
    InEnable: null,
    InType: null,
    OutEnable: null,
    OutType: null,
    RexEnable: null,
    RexType: null,
    ContactEnable: null,
    ContactType: null,
    ProppedTime: '',
    AdaTime: '',
    LockType: null,
    RelockOnOpen: null,
    UnlockTime: '',
    ExtendedUnlock: null,
    ExUnlockTime: '',
    ThreatLevel: null,
    ThreatIgnoreRex: null,
    PairDoorEnable: null,
    ChannelEnable: null,
    ForcedEnable: null,
    ProppedEnable: null,
    AlertOutput: null,
    ShuntEnable: null,
    BurgAlarmEnable: null,
    BurgZoneEnable: null,
    OccupancyEnable: null,
    AntiPassbackRule: null,
    AntiPassbackType: null,
    AntiPassbackTime: '',
    SubnodeNo: '',
    NodeNo: '',
    InReader: null,
    OutReader: null,
    RexInput: null,
    LockOutput: null,
    ContactInput: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IDoorFormData>>(
    {},
    scrollToErrorElement
  )

  // Fetch the details of the Door from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IDoorResult>>(
    queryId ? doorApi.details(queryId) : null
  )

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const {
        DoorName,
        DoorDesc,
        NodeNo,
        SubnodeNo,
        Partition,
        InEnable,
        InType,
        OutEnable,
        OutType,
        RexEnable,
        RexType,
        ContactEnable,
        ContactType,
        ProppedTime,
        AdaTime,
        LockType,
        RelockOnOpen,
        UnlockTime,
        ExtendedUnlock,
        ExUnlockTime,
        ThreatLevel,
        ThreatIgnoreRex,
        PairDoorEnable,
        ChannelEnable,
        ForcedEnable,
        ProppedEnable,
        AlertOutput,
        ShuntEnable,
        BurgAlarmEnable,
        BurgZoneEnable,
        OccupancyEnable,
        AntiPassbackRule,
        AntiPassbackType,
        AntiPassbackTime,
        InRegion,
        OutRegion,
        Threat,
        PairDoor,
        Channel,
        ShuntOutput,
        BurgOutput,
        BurgInput,
        BurgZoneInput,
        OccupancyInput,

        InReader,
        OutReader,
        RexInput,
        LockOutput,
        ContactInput,
      } = data.data

      setFormData({
        DoorName,
        DoorDesc,
        SubnodeNo: SubnodeNo.toString(),
        NodeNo: NodeNo.toString(),
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
        PairDoorEnable: findSelectOption(booleanSelectOption, PairDoorEnable),
        ChannelEnable: findSelectOption(booleanSelectOption, ChannelEnable),
        ForcedEnable: findSelectOption(booleanSelectOption, ForcedEnable),
        ProppedEnable: findSelectOption(booleanSelectOption, ProppedEnable),
        AlertOutput:
          AlertOutput !== null
            ? {
                label: AlertOutput.OutputName,
                value: AlertOutput.OutputNo.toString(),
              }
            : null,
        ShuntEnable: findSelectOption(booleanSelectOption, ShuntEnable),
        BurgAlarmEnable: findSelectOption(booleanSelectOption, BurgAlarmEnable),
        BurgZoneEnable: findSelectOption(booleanSelectOption, BurgZoneEnable),
        OccupancyEnable: findSelectOption(booleanSelectOption, OccupancyEnable),
        AntiPassbackRule: findSelectOption(booleanSelectOption, AntiPassbackRule),
        AntiPassbackType:
          AntiPassbackType !== null
            ? findSelectOption(doorAntiPassTypeOption, AntiPassbackType)
            : null,
        AntiPassbackTime: AntiPassbackTime !== null ? AntiPassbackTime.toString() : '',
        InRegion: InRegion
          ? {
              label: InRegion.RegionName,
              value: InRegion.RegionNo.toString(),
            }
          : null,
        OutRegion: OutRegion
          ? {
              label: OutRegion.RegionName,
              value: OutRegion.RegionNo.toString(),
            }
          : null,
        Threat: Threat
          ? {
              label: Threat.ThreatName,
              value: Threat.ThreatNo.toString(),
            }
          : null,
        PairDoor: PairDoor
          ? {
              label: PairDoor.DoorName,
              value: PairDoor.DoorNo.toString(),
            }
          : null,
        Channel: Channel
          ? {
              label: Channel.ChannelName,
              value: Channel.ChannelNo.toString(),
            }
          : null,
        ShuntOutput: ShuntOutput
          ? {
              label: ShuntOutput.OutputName,
              value: ShuntOutput.OutputNo.toString(),
            }
          : null,
        BurgOutput: BurgOutput
          ? {
              label: BurgOutput.OutputName,
              value: BurgOutput.OutputNo.toString(),
            }
          : null,
        BurgInput: BurgInput
          ? {
              label: BurgInput.InputName,
              value: BurgInput.InputNo.toString(),
            }
          : null,
        BurgZoneInput: BurgZoneInput
          ? {
              label: BurgZoneInput.InputName,
              value: BurgZoneInput.InputNo.toString(),
            }
          : null,
        OccupancyInput: OccupancyInput
          ? {
              label: OccupancyInput.InputName,
              value: OccupancyInput.InputNo.toString(),
            }
          : null,
        InReader: InReader
          ? // {
            //     label: InReader.ReaderName,
            //     value: InReader.ReaderNo.toString(),
            //   }
            null
          : null,
        OutReader: OutReader
          ? // {
            //     label: OutReader.ReaderName,
            //     value: OutReader.ReaderNo.toString(),
            //   }
            null
          : null,
        RexInput: RexInput
          ? {
              label: RexInput.InputName,
              value: RexInput.InputNo.toString(),
            }
          : null,
        LockOutput: LockOutput
          ? {
              label: LockOutput.OutputName,
              value: LockOutput.OutputNo.toString(),
            }
          : null,
        ContactInput: ContactInput
          ? {
              label: ContactInput.InputName,
              value: ContactInput.InputNo.toString(),
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

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(doorApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.doorInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateDoorFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      // error_toast
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      PartitionNo: formData.Partition?.value,
      InRegionNo: formData.InRegion?.value,
      OutRegionNo: formData.OutRegion?.value,
      ThreatNo: formData.Threat?.value,
      PairDoorNo: formData.PairDoor?.value,
      ChannelNo: formData.Channel?.value,
      ShuntOutputNo: formData.ShuntOutput?.value,
      BurgOutputNo: formData.BurgOutput?.value,
      BurgInputNo: formData.BurgInput?.value,
      BurgZoneInputNo: formData.BurgZoneInput?.value,
      OccupancyInputNo: formData.OccupancyInput?.value,
      DoorName: formData.DoorName,
      DoorDesc: formData.DoorDesc,
      InEnable: formData.InEnable?.value,
      InType: formData.InType?.value,
      OutEnable: formData.OutEnable?.value,
      OutType: formData.OutType?.value,
      RexEnable: formData.RexEnable?.value,
      RexType: formData.RexType?.value,
      ContactEnable: formData.ContactEnable?.value,
      ContactType: formData.ContactType?.value,
      ProppedTime: formData.ProppedTime,
      AdaTime: formData.AdaTime,
      LockType: formData.LockType?.value,
      RelockOnOpen: formData.RelockOnOpen?.value,
      UnlockTime: formData.UnlockTime, // Old code
      // UnlockTime: formData.ExtendedUnlock?.value !== '0' ? (Number(Number(formData.UnlockTime) + Number(formData.ExUnlockTime)*60)).toString() : formData.UnlockTime,
      ExtendedUnlock: formData.ExtendedUnlock?.value,
      ExUnlockTime: formData.ExUnlockTime,
      ThreatLevel: formData.ThreatLevel?.value,
      ThreatIgnoreRex: formData.ThreatIgnoreRex?.value,
      PairDoorEnable: formData.PairDoorEnable?.value,
      ChannelEnable: formData.ChannelEnable?.value,
      ForcedEnable: formData.ForcedEnable?.value,
      ProppedEnable: formData.ProppedEnable?.value,
      AlertOutputNo: formData.AlertOutput?.value,
      ShuntEnable: formData.ShuntEnable?.value,
      BurgAlarmEnable: formData.BurgAlarmEnable?.value,
      BurgZoneEnable: formData.BurgZoneEnable?.value,
      OccupancyEnable: formData.OccupancyEnable?.value,
      AntiPassbackRule: formData.AntiPassbackRule?.value,
      AntiPassbackType: formData.AntiPassbackType?.value,
      AntiPassbackTime: formData.AntiPassbackTime,
      InReaderNo: formData.InReader?.value,
      OutReaderNo: formData.OutReader?.value,
      RexInputNo: formData.RexInput?.value,
      LockOutputNo: formData.LockOutput?.value,
      ContactInputNo: formData.ContactInput?.value,
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
      link: routeProperty.doorInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} sameHeight>
        <DoorForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorReaderForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorRexForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorContactForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorLockForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorThreatLevelForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorPairForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          doorNo={queryId}
        />

        <DoorChannelForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorAlertForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorShuntForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorBuglarAlarmForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorOccupancySensorForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <DoorAntiPassBackForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
      </FormContainer>

      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.doorInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditDoor
