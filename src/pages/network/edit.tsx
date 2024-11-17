import { sendPostRequest } from '../../api/swrConfig'
import { networkApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import NetworkCertificateForm from '../../components/pages/network/NetworkCertificateForm'
import NetworkCloudForm from '../../components/pages/network/NetworkCloudForm'
import NetworkForm from '../../components/pages/network/NetworkForm'
import NetworkMasterForm from '../../components/pages/network/NetworkMasterForm'
import NetworkWifiForm from '../../components/pages/network/NetworkWifiForm'
import useAuth from '../../hooks/useAuth'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  booleanSelectOption,
} from '../../types/pages/common'
import { INetworkFormData, INetworkResult } from '../../types/pages/network'
import checkRequiredFields from '../../utils/checkRequiredFields'
import { findSelectOptionOrDefault } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../utils/toast'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to edit Network
function EditNetwork() {
  const navigate = useNavigate()
  const { license } = useAuth()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<INetworkFormData>({
    Dhcp: null,
    Address: '',
    Netmask: '',
    Gateway: '',
    Dns1: '',
    Dns2: '',
    SelfSigned: null,
    Country: null,
    Organization: '',
    Address2: '',
    Address3: '',
    MasterAddr: '',
    MasterPort: '',
    Cloud: null,
    CloudAddr: '',
    CloudPort: '',
    SiteNo: '',
    SiteKey: '',
    Wifi: null,
    Ssid: '',
    SecuKey: '',
  })

  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<INetworkFormData>>(
    {},
    scrollToErrorElement
  )

  // Fetch the details of the Network from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<INetworkResult>>(networkApi.details)
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const {
        Dhcp,
        Address,
        Netmask,
        Gateway,
        Dns1,
        Dns2,
        SelfSigned,
        Country,
        Organization,
        Address2,
        Address3,
        MasterAddr,
        MasterPort,
        Cloud,
        CloudAddr,
        CloudPort,
        SiteNo,
        SiteKey,
        Wifi,
        Ssid,
        SecuKey,
      } = data.data

      setFormData({
        Dhcp: findSelectOptionOrDefault(booleanSelectOption, Dhcp),
        Address,
        Netmask,
        Gateway,
        Dns1,
        Dns2,
        SelfSigned: findSelectOptionOrDefault(booleanSelectOption, SelfSigned),
        Country: {
          label: Country,
          value: Country,
        },
        Organization,
        Address2,
        Address3,
        MasterAddr,
        MasterPort: String(MasterPort),
        Cloud: findSelectOptionOrDefault(booleanSelectOption, Cloud),
        CloudAddr,
        CloudPort: String(CloudPort),
        SiteNo: String(SiteNo),
        SiteKey,
        Wifi: findSelectOptionOrDefault(booleanSelectOption, Wifi),
        Ssid,
        SecuKey,
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))

    if (
      name === 'Dhcp' &&
      value &&
      typeof value === 'object' &&
      'value' in value &&
      value.value === '1'
    ) {
      setFormErrors({
        ...formErrors,
        Dhcp: undefined,
        Address: undefined,
        Netmask: undefined,
        Gateway: undefined,
        Dns1: undefined,
      })
    } else {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(networkApi.edit, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.networkInfo.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    const requiredFields: Array<keyof INetworkFormData> = []

    if (formData?.Dhcp?.value === '0') {
      requiredFields.push('Address', 'Netmask', 'Gateway', 'Dns1')
    }

    if (formData?.SelfSigned?.value === '1') {
      requiredFields.push('Country', 'Organization')
    }

    if (formData?.Cloud?.value === '1') {
      requiredFields.push('CloudAddr', 'SiteNo', 'SiteKey')
    }

    if (formData?.Wifi?.value === '1') {
      requiredFields.push('Ssid', 'SecuKey')
    }

    if (formData?.Wifi?.value === '1') {
      requiredFields.push('Ssid', 'SecuKey')
    }

    if (formData?.Cloud?.value === '0' && license?.NodeType !== 1) {
      requiredFields.push('MasterAddr', 'MasterPort')
    }

    const errors = checkRequiredFields<INetworkFormData>(requiredFields, formData)

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
      Dhcp: Number(formData.Dhcp?.value),
      Address: formData.Address,
      Netmask: formData.Netmask,
      Gateway: formData.Gateway,
      Dns1: formData.Dns1,
      Dns2: formData.Dns2,
      SelfSigned: Number(formData.SelfSigned?.value),
      Country: formData.Country?.value,
      Organization: formData.Organization,
      Address2: formData.Address2,
      Address3: formData.Address3,
      MasterAddr: formData.MasterAddr,
      MasterPort: Number(formData.MasterPort),
      Cloud: Number(formData.Cloud?.value),
      CloudAddr: formData.CloudAddr,
      CloudPort: Number(formData.CloudPort),
      SiteNo: Number(formData.SiteNo),
      SiteKey: formData.SiteKey,
      Wifi: Number(formData.Wifi?.value),
      Ssid: formData.Ssid,
      SecuKey: formData.SecuKey,
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
      link: routeProperty.networkInfo.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        // breadcrumbs navbar & router link
        pageRoutes={[
          {
            href: routeProperty.networkInfo.path(),
            text: t`Network`,
          },
          {
            href: routeProperty.networkEdit.path(),
            text: t`Edit`,
          },
        ]}
        // --rubel
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} sameHeight twoPart={false}>
        <NetworkForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
        <NetworkCertificateForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
        <NetworkMasterForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
        <NetworkCloudForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
        <NetworkWifiForm
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
        <Button size="large" color="cancel" link={routeProperty.networkInfo.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditNetwork
