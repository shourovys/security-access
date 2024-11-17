// @ts-nocheck

import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../../../api/swrConfig'
import { nodeScanApi } from '../../../../api/urls'
import FormActionButtonsContainer from '../../../../components/HOC/style/form/FormActionButtonsContainer'
import FormContainer from '../../../../components/HOC/style/form/FormContainer'
import Button from '../../../../components/atomic/Button'
import NetworkCertificateForm from '../../../../components/pages/network/NetworkCertificateForm'
import NetworkCloudForm from '../../../../components/pages/network/NetworkCloudForm'
import NetworkForm from '../../../../components/pages/network/NetworkForm'
import NetworkMasterForm from '../../../../components/pages/network/NetworkMasterForm'
import NetworkWifiForm from '../../../../components/pages/network/NetworkWifiForm'
import useStateWithCallback from '../../../../hooks/useStateWithCallback'
import { THandleInputChange } from '../../../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  booleanSelectOption,
} from '../../../../types/pages/common'
import { INetworkFormData, INetworkResult } from '../../../../types/pages/network'
import checkRequiredFields from '../../../../utils/checkRequiredFields'
import { findSelectOptionOrDefault } from '../../../../utils/findSelectOption'
import Icon, { applyIcon, cancelIcon } from '../../../../utils/icons'
import scrollToErrorElement from '../../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../../utils/serverErrorHandler'
import { addSuccessfulToast } from '../../../../utils/toast'
import t from '../../../../utils/translator'

interface IProps {
  Macs: string[]
  networkData: INetworkResult | null
  isLoading?: boolean
  setOpenModal: (openModal: boolean) => void
}

const userId = sessionStorage.getItem('UserId')
const password = sessionStorage.getItem('Password')

const NetworkModal = ({ Macs, networkData, isLoading, setOpenModal }: IProps) => {
  // const navigate = useNavigate()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<INetworkFormData>({
    UserId: userId && userId,
    Password: password && password,
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

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (networkData) {
      const {
        UserId,
        Password,
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
      } = networkData

      setFormData({
        UserId,
        Password,
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
  }, [networkData])

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
  const { trigger, isMutating } = useSWRMutation(nodeScanApi.setNetwork, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast(`Success`)
      setOpenModal(false)
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
      UserId: userId && userId,
      Password: password && password,
      Macs,
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
    console.log(`trigger done`)
    console.log(`this is network modal file`, formData)
    trigger(modifiedFormData)
  }

  console.log(`this is network modal file`, formData)

  return (
    <div className="w-full px-4 pt-4 bg-white rounded-md">
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
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
      <FormActionButtonsContainer allowsShow>
        <Button size="base" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="base" color="cancel" onClick={() => setOpenModal(false)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer>
    </div>
  )
}

export default NetworkModal
