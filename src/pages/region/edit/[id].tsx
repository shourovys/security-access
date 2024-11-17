// import { sendPutRequest } from '../../../api/swrConfig'
// import { regionApi } from '../../../api/urls'
// import { AxiosError } from 'axios'
// import Page from '../../../components/HOC/Page'
// import FormContainer from '../../../components/HOC/style/form/FormContainer'
// import Breadcrumbs from '../../../components/layout/Breadcrumbs'
// import RegionAntiPassBackForm from '../../../components/pages/region/form/RegionAntiPassBackForm'
// import RegionAntiTailgateForm from '../../../components/pages/region/form/RegionAntiTailgateForm'
// import RegionDeadmanRuleForm from '../../../components/pages/region/form/RegionDeadmanRuleForm'
// import RegionForm from '../../../components/pages/region/form/RegionForm'
// import RegionHazmatRuleForm from '../../../components/pages/region/form/RegionHazmatRuleForm'
// import RegionOccupancyForm from '../../../components/pages/region/form/RegionOccupancyForm'
// import RegionResetDailyForm from '../../../components/pages/region/form/RegionResetDailyForm'
// import useStateWithCallback from '../../../hooks/useStateWithCallback'
// import { useEffect, useState } from 'react'
// import { useBeforeunload } from 'react-beforeunload'
// import { useNavigate, useParams } from 'react-router-dom'
// import routeProperty from '../../../routes/routeProperty'
// import useSWR from 'swr'
// import useSWRMutation from 'swr/mutation'
// import { IActionsButton } from '../../../types/components/actionButtons'
// import { THandleInputChange } from '../../../types/components/common'
// import {
//   IFormErrors,
//   IServerCommandErrorResponse,
//   IServerErrorResponse,
//   ISingleServerResponse,
//   booleanSelectOption,
// } from '../../../types/pages/common'
// import { IRegionFormData, IRegionResult, regionRoleOptions } from '../../../types/pages/region'
// import { findSelectOption } from '../../../utils/findSelectOption'
// import { applyIcon, cancelIcon } from '../../../utils/icons'
// import scrollToErrorElement from '../../../utils/scrollToErrorElement'
// import { editSuccessfulToast } from '../../../utils/toast'
// import validateRegionFormData from '../../../utils/validation/region'
// import serverErrorHandler from '../../../utils/serverErrorHandler'
// import t from '../../../utils/translator'

// // Component to edit a Region
// function EditRegion() {
//   const navigate = useNavigate()
//   // Get the region ID from the router query
//   const params = useParams()
//   const queryId = params.id as string

//   // Prompt the user before unloading the page if there are unsaved changes
//   useBeforeunload(() => t('You will lose your changes!'))

//   // Define the initial state of the form data and form errors
//   const [formData, setFormData] = useState<IRegionFormData>({
//     RegionName: '',
//     RegionDesc: '',
//     Partition: null,
//     OnlyMuster: null,
//     AntiPassbackRule: null,
//     AntiPassbackTime: '',
//     AntiTailgateRule: null,
//     OccupancyRule: null,
//     OccupancyLimit: '',
//     DeadmanRule: null,
//     DeadmanInterval: '',
//     DeadmanOutputNo: null,
//     HazmatRule: null,
//     HazmatInputNo: null,
//     HazmatOutputNo: null,
//     ResetDaily: null,
//     ResetTime: '',
//     // DeadmanStat: null,
//     // HazmatStat: null,
//   })
//   const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

//   // Fetch the details of the Region from the server
//   const { isLoading, data } = useSWR<ISingleServerResponse<IRegionResult>>(
//     queryId ? regionApi.details(queryId) : null
//   )
//   useEffect(() => {
//     if (data) {
//       // Set the form data to the fetched data once it's available
//       const {
//         RegionName,
//         RegionDesc,
//         OnlyMuster,
//         AntiPassbackRule,
//         AntiPassbackTime,
//         AntiTailgateRule,
//         OccupancyRule,
//         OccupancyLimit,
//         DeadmanRule,
//         DeadmanInterval,
//         DeadmanOutput,
//         HazmatRule,
//         HazmatInput,
//         HazmatOutput,
//         ResetDaily,
//         ResetTime,
//         // DeadmanStat,
//         // HazmatStat,
//         Partition,
//       } = data.data

//       setFormData({
//         RegionName,
//         RegionDesc,
//         OnlyMuster: findSelectOption(booleanSelectOption, OnlyMuster),
//         AntiPassbackRule: findSelectOption(regionRoleOptions, AntiPassbackRule),
//         AntiPassbackTime: AntiPassbackTime.toString(),
//         AntiTailgateRule: findSelectOption(regionRoleOptions, AntiTailgateRule),
//         OccupancyRule: findSelectOption(regionRoleOptions, OccupancyRule),
//         OccupancyLimit: OccupancyLimit.toString(),
//         DeadmanRule: findSelectOption(booleanSelectOption, DeadmanRule),
//         DeadmanInterval: DeadmanInterval.toString(),
//         DeadmanOutputNo: DeadmanOutput
//           ? {
//               label: DeadmanOutput.OutputName,
//               value: DeadmanOutput.OutputNo.toString(),
//             }
//           : null,
//         HazmatRule: findSelectOption(booleanSelectOption, HazmatRule),
//         HazmatInputNo: HazmatInput
//           ? {
//               label: HazmatInput.InputName,
//               value: HazmatInput.InputNo.toString(),
//             }
//           : null,
//         HazmatOutputNo: HazmatOutput
//           ? {
//               label: HazmatOutput.OutputName,
//               value: HazmatOutput.OutputNo.toString(),
//             }
//           : null,
//         ResetDaily: findSelectOption(booleanSelectOption, ResetDaily),
//         ResetTime: ResetTime.toString(),
//         // DeadmanStat: findSelectOption(booleanSelectOption, DeadmanStat),
//         // HazmatStat: findSelectOption(booleanSelectOption, HazmatStat),
//         Partition: Partition
//           ? { value: Partition.PartitionNo.toString(), label: Partition.PartitionName }
//           : null,
//       })
//     }
//   }, [data])

//   // Update the form data when any input changes
//   const handleInputChange: THandleInputChange = (name, value) => {
//     // if Only muster is false. reset all relented values
//     if (
//       name === 'OnlyMuster' &&
//       value &&
//       typeof value === 'object' &&
//       'value' in value &&
//       value?.value === '1'
//     ) {
//       setFormData((state) => ({
//         ...state,
//         AntiPassbackRule: regionRoleOptions[0],
//         AntiPassbackTime: '',
//         AntiTailgateRule: regionRoleOptions[0],
//         OccupancyRule: regionRoleOptions[0],
//         OccupancyLimit: '',
//         DeadmanRule: booleanSelectOption[0],
//         DeadmanInterval: '',
//         DeadmanOutputNo: null,
//         HazmatRule: booleanSelectOption[0],
//         HazmatInputNo: null,
//         HazmatOutputNo: null,
//         ResetDaily: booleanSelectOption[0],
//         ResetTime: '',
//         // DeadmanStat: booleanSelectOption[0],
//         // HazmatStat: booleanSelectOption[0],
//       }))
//     }
//     setFormData((state) => ({ ...state, [name]: value }))
//     setFormErrors({ ...formErrors, [name]: null })
//   }

//   // Define the mutation function to send the form data to the server
//   const { trigger, isMutating } = useSWRMutation(regionApi.edit(queryId), sendPutRequest, {
//     onSuccess: () => {
//       editSuccessfulToast()
//       navigate(routeProperty.regionInfo.path(queryId))
//     },
//     onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
//       serverErrorHandler(error, setFormErrors)
//     },
//   })

//   // Handle the form submission
//   const handleSubmit = async () => {
//     // Validate the form data
//     const errors = validateRegionFormData(formData)

//     // If there are errors, display them and do not submit the form
//     if (Object.keys(errors).length) {
//       setFormErrors(errors)
//       //Object.entries(errors).forEach(([, value]) => {
//       //   if (value) {
//       //     errorToast(value)
//       //   }
//       // })
//       return
//     }

//     // Modify form data to match API requirements and trigger the mutation
//     const modifiedFormData = {
//       RegionName: formData.RegionName,
//       RegionDesc: formData.RegionDesc,
//       OnlyMuster: formData.OnlyMuster?.value,
//       AntiPassbackRule: formData.AntiPassbackRule?.value,
//       AntiPassbackTime: Number(formData.AntiPassbackTime),
//       AntiTailgateRule: formData.AntiTailgateRule?.value,
//       OccupancyRule: formData.OccupancyRule?.value,
//       OccupancyLimit: Number(formData.OccupancyLimit),
//       DeadmanRule: formData.DeadmanRule?.value,
//       DeadmanInterval: Number(formData.DeadmanInterval),
//       DeadmanOutputNo: Number(formData.DeadmanOutputNo?.value),
//       HazmatRule: formData.HazmatRule?.value,
//       HazmatInputNo: Number(formData.HazmatInputNo?.value),
//       HazmatOutputNo: Number(formData.HazmatOutputNo?.value),
//       ResetDaily: Number(formData.ResetDaily?.value),
//       ResetTime: formData.ResetTime,
//       // DeadmanStat: formData.DeadmanStat?.value,
//       // HazmatStat: formData.HazmatStat?.value,
//       PartitionNo: formData.Partition?.value,
//     }
//     trigger(modifiedFormData)
//   }

//   // Define the actions for the breadcrumbs bar
//   const breadcrumbsActionsButtons: IActionsButton[] = [
//     {
//       color: 'apply',
//       icon: applyIcon,
//       text: t`Apply`,
//       onClick: handleSubmit,
//       isLoading: isMutating,
//     },
//     {
//       color: 'cancel',
//       icon: cancelIcon,
//       text: t`Cancel`,
//       link: routeProperty.regionInfo.path(queryId),
//     },
//   ]

//   return (
//     <Page>
//       {/* Render the breadcrumbs bar with the defined actions */}
//       <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
//       <div className="pt-2" />
//       <FormContainer errorAlert={formErrors?.non_field_errors} sameHeight>
//         <RegionForm
//           formData={formData}
//           handleInputChange={handleInputChange}
//           formErrors={formErrors}
//           isLoading={isLoading}
//         />
//         <RegionAntiPassBackForm
//           formData={formData}
//           handleInputChange={handleInputChange}
//           formErrors={formErrors}
//           disabled={formData.OnlyMuster?.value !== '0'}
//           isLoading={isLoading}
//         />
//         <RegionAntiTailgateForm
//           formData={formData}
//           handleInputChange={handleInputChange}
//           disabled={formData.OnlyMuster?.value !== '0'}
//           isLoading={isLoading}
//         />
//         <RegionOccupancyForm
//           formData={formData}
//           handleInputChange={handleInputChange}
//           formErrors={formErrors}
//           disabled={formData.OnlyMuster?.value !== '0'}
//           isLoading={isLoading}
//         />
//         <RegionDeadmanRuleForm
//           formData={formData}
//           handleInputChange={handleInputChange}
//           formErrors={formErrors}
//           disabled={formData.OnlyMuster?.value !== '0'}
//           isLoading={isLoading}
//         />
//         <RegionHazmatRuleForm
//           formData={formData}
//           handleInputChange={handleInputChange}
//           formErrors={formErrors}
//           disabled={formData.OnlyMuster?.value !== '0'}
//           isLoading={isLoading}
//         />
//         <RegionResetDailyForm
//           formData={formData}
//           handleInputChange={handleInputChange}
//           formErrors={formErrors}
//           disabled={formData.OnlyMuster?.value !== '0'}
//           isLoading={isLoading}
//         />
//         {/* <RegionStatusForm
//           formData={formData}
//           handleInputChange={handleInputChange}
//           disabled={formData.OnlyMuster?.value !== '0'}
//           isLoading={isLoading}
//         /> */}
//       </FormContainer>

//       {/* <FormActionButtonsContainer>
//         <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
//           <Icon icon={applyIcon} />
//           <span>{t`Apply`}</span>
//         </Button>
//         <Button size="large" color="cancel" link={routeProperty.regionInfo.path(queryId)}>
//           <Icon icon={cancelIcon} />
//           <span>{t`Cancel`}</span>
//         </Button>
//       </FormActionButtonsContainer> */}
//     </Page>
//   )
// }

// export default EditRegion

// @ts-nocheck
import { sendPutRequest } from '../../../api/swrConfig'
import { regionApi } from '../../../api/urls'
import { AxiosError } from 'axios'
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
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  booleanSelectOption,
} from '../../../types/pages/common'
import { IRegionFormData, IRegionResult, regionRoleOptions } from '../../../types/pages/region'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import validateRegionFormData from '../../../utils/validation/region'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'

// Component to edit a Region
function EditRegion() {
  const navigate = useNavigate()
  // Get the region ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
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
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Region from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IRegionResult>>(
    queryId ? regionApi.details(queryId) : null
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

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    // if Only muster is false. reset all relented values
    if (
      name === 'OnlyMuster' &&
      value &&
      typeof value === 'object' &&
      'value' in value &&
      value?.value === '1'
    ) {
      setFormData((state) => ({
        ...state,
        AntiPassbackRule: regionRoleOptions[0],
        AntiPassbackTime: '',
        AntiTailgateRule: regionRoleOptions[0],
        OccupancyRule: regionRoleOptions[0],
        OccupancyLimit: '',
        DeadmanRule: booleanSelectOption[0],
        DeadmanInterval: '',
        DeadmanOutputNo: null,
        HazmatRule: booleanSelectOption[0],
        HazmatInputNo: null,
        HazmatOutputNo: null,
        ResetDaily: booleanSelectOption[0],
        ResetTime: '',
        // DeadmanStat: booleanSelectOption[0],
        // HazmatStat: booleanSelectOption[0],
      }))
    }
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(regionApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.regionInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateRegionFormData(formData)

    // If there are errors, display them and do not submit the form
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
      RegionName: formData.RegionName,
      RegionDesc: formData.RegionDesc,
      OnlyMuster: formData.OnlyMuster?.value,
      AntiPassbackRule: formData.AntiPassbackRule?.value,
      AntiPassbackTime: Number(formData.AntiPassbackTime),
      AntiTailgateRule: formData.AntiTailgateRule?.value,
      OccupancyRule: formData.OccupancyRule?.value,
      OccupancyLimit: Number(formData.OccupancyLimit),
      DeadmanRule: formData.DeadmanRule?.value,
      DeadmanInterval: formData.DeadmanInterval ? Number(formData.DeadmanInterval) : 0,
      DeadmanOutputNo: formData.DeadmanOutputNo ? Number(formData.DeadmanOutputNo?.value) : 0,
      HazmatRule: formData.HazmatRule ? formData.HazmatRule?.value : 0,
      HazmatInputNo: formData.HazmatInputNo ? Number(formData.HazmatInputNo?.value) : 0,
      HazmatOutputNo: formData.HazmatOutputNo ? Number(formData.HazmatOutputNo?.value) : 0,
      ResetDaily: Number(formData.ResetDaily?.value),
      ResetTime: formData.ResetTime,
      // DeadmanStat: formData.DeadmanStat?.value,
      // HazmatStat: formData.HazmatStat?.value,
      PartitionNo: formData.Partition?.value,
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
      link: routeProperty.regionInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} sameHeight>
        <RegionForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={isLoading}
        />
        <RegionAntiPassBackForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={formData.OnlyMuster?.value !== '0'}
          isLoading={isLoading}
        />
        <RegionAntiTailgateForm
          formData={formData}
          handleInputChange={handleInputChange}
          disabled={formData.OnlyMuster?.value !== '0'}
          isLoading={isLoading}
        />
        <RegionOccupancyForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={formData.OnlyMuster?.value !== '0'}
          isLoading={isLoading}
        />
        <RegionDeadmanRuleForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={formData.OnlyMuster?.value !== '0'}
          isLoading={isLoading}
        />
        <RegionHazmatRuleForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={formData.OnlyMuster?.value !== '0'}
          isLoading={isLoading}
        />
        <RegionResetDailyForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={formData.OnlyMuster?.value !== '0'}
          isLoading={isLoading}
        />
        {/* <RegionStatusForm
          formData={formData}
          handleInputChange={handleInputChange}
          disabled={formData.OnlyMuster?.value !== '0'}
          isLoading={isLoading}
        /> */}
      </FormContainer>

      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.regionInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditRegion
