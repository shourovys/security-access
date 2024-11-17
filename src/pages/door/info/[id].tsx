import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { doorApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
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
import DoorStatusForm from '../../../components/pages/door/form/DoorStatusForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../../types/pages/common'
import {
  IDoorInfoFormData,
  IDoorResult,
  doorAlertStatObject,
  doorAntiPassTypeOption,
  doorContactStatObject,
  doorLockStatObject,
  doorLockTypeOption,
  doorReaderTypeOption,
  doorRexAndContactTypeOption,
  doorStatObject,
  doorThreatLevelOption,
} from '../../../types/pages/door'
import { findSelectOption } from '../../../utils/findSelectOption'
import { editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a door
function DoorInfo() {
  const navigate = useNavigate()
  // Get the door ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IDoorInfoFormData>({
    NodeName: '',
    SubnodeName: '',
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
    DoorPort: '',
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
    DoorStat: '',
    LockStat: '',
    ContactStat: '',
    AlertStat: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Door from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IDoorResult>>(
    isDeleted || !queryId ? null : doorApi.details(queryId)
  )

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const {
        DoorName,
        DoorDesc,
        DoorPort,
        Node,
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

        SubnodeNo,
        NodeNo,
        Subnode,
        InReader,
        OutReader,
        RexInput,
        LockOutput,
        ContactInput,

        DoorStat,
        LockStat,
        ContactStat,
        AlertStat,
      } = data.data

      setFormData({
        DoorName,
        DoorDesc,
        DoorPort: DoorPort.toString(),
        NodeName: Node?.NodeName || '',
        SubnodeName: Subnode?.SubnodeName || '',
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
          ? {
              label: InReader.ReaderName,
              value: InReader.ReaderNo.toString(),
            }
          : null,
        OutReader: OutReader
          ? {
              label: OutReader.ReaderName,
              value: OutReader.ReaderNo.toString(),
            }
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

        DoorStat: doorStatObject[DoorStat],
        LockStat: doorLockStatObject[LockStat],
        ContactStat: doorContactStatObject[ContactStat],
        AlertStat: doorAlertStatObject[AlertStat],
      })
    }
  }, [data])

  // Define the mutation function to delete the door from the server
  const { trigger: deleteTrigger } = useSWRMutation(doorApi.delete(queryId), sendDeleteRequest, {
    // Show a success message and redirect to door list page on successful delete
    onSuccess: () => {
      navigate(routeProperty.door.path(), { replace: true })
    },
    // If error occurred - make delete false
    onError: () => {
      setIsDeleted(false)
    },
  })
  // Define the function to call delete mutation with Alert Dialog
  // const handleDelete = () => {
  //   const deleteMutation = () => {
  //     setIsDeleted(true)
  //     return deleteTrigger()
  //   }
  //   openAlertDialogWithPromise(deleteMutation, { success: t`Successful` })
  // }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.doorEdit.path(queryId),
    },
    {
      color: 'danger',
      icon: listIcon,
      text: t`List`,
      link: routeProperty.door.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer sameHeight>
        <DoorForm formData={formData} isLoading={isLoading} />

        <DoorReaderForm formData={formData} isLoading={isLoading} />

        <DoorRexForm formData={formData} isLoading={isLoading} />

        <DoorContactForm formData={formData} isLoading={isLoading} />

        <DoorLockForm formData={formData} isLoading={isLoading} />

        <DoorThreatLevelForm formData={formData} isLoading={isLoading} />

        <DoorPairForm formData={formData} isLoading={isLoading} doorNo={queryId} />

        <DoorChannelForm formData={formData} isLoading={isLoading} />

        <DoorAlertForm formData={formData} isLoading={isLoading} />

        <DoorShuntForm formData={formData} isLoading={isLoading} />

        <DoorBuglarAlarmForm formData={formData} isLoading={isLoading} />

        <DoorOccupancySensorForm formData={formData} isLoading={isLoading} />

        <DoorAntiPassBackForm formData={formData} isLoading={isLoading} />

        <DoorStatusForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default DoorInfo
