import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { regionApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import RegionAntiPassBackForm from '../../../components/pages/region/form/RegionAntiPassBackForm'
import RegionAntiTailgateForm from '../../../components/pages/region/form/RegionAntiTailgateForm'
import RegionDeadmanRuleForm from '../../../components/pages/region/form/RegionDeadmanRuleForm'
import RegionForm from '../../../components/pages/region/form/RegionForm'
import RegionHazmatRuleForm from '../../../components/pages/region/form/RegionHazmatRuleForm'
import RegionOccupancyForm from '../../../components/pages/region/form/RegionOccupancyForm'
import RegionResetDailyForm from '../../../components/pages/region/form/RegionResetDailyForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../../types/pages/common'
import { IRegionFormData, IRegionResult, regionRoleOptions } from '../../../types/pages/region'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a region
function RegionInfo() {
  const navigate = useNavigate()
  // Get the region ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IRegionFormData>({
    RegionName: '',
    RegionDesc: '',
    Partition: null,
    OnlyMuster: null,
    AntiPassbackRule: null,
    AntiPassbackTime: '',
    AntiTailgateRule: null,
    OccupancyRule: null,
    OccupancyLimit: '',
    DeadmanRule: null,
    DeadmanInterval: '',
    DeadmanOutputNo: null,
    HazmatRule: null,
    HazmatInputNo: null,
    HazmatOutputNo: null,
    ResetDaily: null,
    ResetTime: '',
    // DeadmanStat: null,
    // HazmatStat: null,
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Region from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IRegionResult>>(
    isDeleted || !queryId ? null : regionApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        RegionName,
        RegionDesc,
        OnlyMuster,
        AntiPassbackRule,
        AntiPassbackTime,
        AntiTailgateRule,
        OccupancyRule,
        OccupancyLimit,
        DeadmanRule,
        DeadmanInterval,
        DeadmanOutput,
        HazmatRule,
        HazmatInput,
        HazmatOutput,
        ResetDaily,
        ResetTime,
        // DeadmanStat,
        // HazmatStat,
        Partition,
      } = data.data

      setFormData({
        RegionName,
        RegionDesc,
        OnlyMuster: findSelectOption(booleanSelectOption, OnlyMuster),
        AntiPassbackRule: findSelectOption(regionRoleOptions, AntiPassbackRule),
        AntiPassbackTime: AntiPassbackTime.toString(),
        AntiTailgateRule: findSelectOption(regionRoleOptions, AntiTailgateRule),
        OccupancyRule: findSelectOption(regionRoleOptions, OccupancyRule),
        OccupancyLimit: OccupancyLimit.toString(),
        DeadmanRule: findSelectOption(booleanSelectOption, DeadmanRule),
        DeadmanInterval: DeadmanInterval.toString(),
        DeadmanOutputNo: DeadmanOutput
          ? {
              label: DeadmanOutput.OutputName,
              value: DeadmanOutput.OutputNo.toString(),
            }
          : null,
        HazmatRule: findSelectOption(booleanSelectOption, HazmatRule),
        HazmatInputNo: HazmatInput
          ? {
              label: HazmatInput.InputName,
              value: HazmatInput.InputNo.toString(),
            }
          : null,
        HazmatOutputNo: HazmatOutput
          ? {
              label: HazmatOutput.OutputName,
              value: HazmatOutput.OutputNo.toString(),
            }
          : null,
        ResetDaily: findSelectOption(booleanSelectOption, ResetDaily),
        ResetTime: ResetTime.toString(),
        // DeadmanStat: findSelectOption(booleanSelectOption, DeadmanStat),
        // HazmatStat: findSelectOption(booleanSelectOption, HazmatStat),
        Partition: Partition
          ? { value: Partition.PartitionNo.toString(), label: Partition.PartitionName }
          : null,
      })
    }
  }, [data])

  // Define the mutation function to delete the region from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    regionApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to region list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.region.path(), { replace: true })
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
      link: routeProperty.regionEdit.path(queryId),
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
      link: routeProperty.region.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer sameHeight>
        <RegionForm formData={formData} isLoading={isLoading} />
        <RegionAntiPassBackForm formData={formData} isLoading={isLoading} />
        <RegionAntiTailgateForm formData={formData} isLoading={isLoading} />
        <RegionOccupancyForm formData={formData} isLoading={isLoading} />
        <RegionDeadmanRuleForm formData={formData} isLoading={isLoading} />
        <RegionHazmatRuleForm formData={formData} isLoading={isLoading} />
        <RegionResetDailyForm formData={formData} isLoading={isLoading} />
        {/* <RegionStatusForm formData={formData} isLoading={isLoading} /> */}
      </FormContainer>
    </Page>
  )
}

export default RegionInfo
