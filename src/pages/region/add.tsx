import { sendPostRequest } from '../../api/swrConfig'
import { regionApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import RegionAntiPassBackForm from '../../components/pages/region/form/RegionAntiPassBackForm'
import RegionAntiTailgateForm from '../../components/pages/region/form/RegionAntiTailgateForm'
import RegionDeadmanRuleForm from '../../components/pages/region/form/RegionDeadmanRuleForm'
import RegionHazmatRuleForm from '../../components/pages/region/form/RegionHazmatRuleForm'
import RegionOccupancyForm from '../../components/pages/region/form/RegionOccupancyForm'
import RegionResetDailyForm from '../../components/pages/region/form/RegionResetDailyForm'
import { useDefaultPartitionOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  booleanSelectOption,
} from '../../types/pages/common'
import { IRegionFormData, regionRoleOptions } from '../../types/pages/region'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { addSuccessfulToast } from '../../utils/toast'
import validateRegionFormData from '../../utils/validation/region'
import RegionForm from '../../components/pages/region/form/RegionForm'
import t from '../../utils/translator'

// Component to create a Region
function CreateRegion() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IRegionFormData>({
    RegionName: '',
    RegionDesc: '',
    Partition: null,
    OnlyMuster: booleanSelectOption[0],
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
  })

  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Set default Partition
  useDefaultPartitionOption<IRegionFormData>(setFormData)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
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
  const { trigger, isMutating } = useSWRMutation(regionApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to region list page on success
      navigate(routeProperty.region.path())
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
      return
    }

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
      DeadmanInterval: Number(formData.DeadmanInterval),
      DeadmanOutputNo: Number(formData.DeadmanOutputNo?.value || 0),
      HazmatRule: formData.HazmatRule?.value,
      HazmatInputNo: Number(formData.HazmatInputNo?.value || 0),
      HazmatOutputNo: Number(formData.HazmatOutputNo?.value || 0),
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
      link: routeProperty.region.path(),
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
        />
        <RegionAntiPassBackForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={formData.OnlyMuster?.value !== '0'}
        />
        <RegionAntiTailgateForm
          formData={formData}
          handleInputChange={handleInputChange}
          disabled={formData.OnlyMuster?.value !== '0'}
        />
        <RegionOccupancyForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={formData.OnlyMuster?.value !== '0'}
        />
        <RegionDeadmanRuleForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={formData.OnlyMuster?.value !== '0'}
        />
        <RegionHazmatRuleForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={formData.OnlyMuster?.value !== '0'}
        />
        <RegionResetDailyForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={formData.OnlyMuster?.value !== '0'}
        />
        {/* <RegionStatusForm
          formData={formData}
          handleInputChange={handleInputChange}
          disabled={formData.OnlyMuster?.value !== '0'}
        /> */}
      </FormContainer>

      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.region.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateRegion
