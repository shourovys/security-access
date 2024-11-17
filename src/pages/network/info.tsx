import { fetcher } from '../../api/swrConfig'
import { networkApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import NetworkCertificateForm from '../../components/pages/network/NetworkCertificateForm'
import NetworkCloudForm from '../../components/pages/network/NetworkCloudForm'
import NetworkForm from '../../components/pages/network/NetworkForm'
import NetworkMasterForm from '../../components/pages/network/NetworkMasterForm'
import NetworkWifiForm from '../../components/pages/network/NetworkWifiForm'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../types/pages/common'
import { INetworkFormData, INetworkResult } from '../../types/pages/network'
import downloadCertificateFile from '../../utils/downloadCertificateFile'
import { findSelectOptionOrDefault } from '../../utils/findSelectOption'
import { certificateDownloadIcon, certificateIcon, editIcon } from '../../utils/icons'
import t from '../../utils/translator'

// Component to show details of network
function NetworkInfo() {
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

  // Fetch the details of the Network from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<INetworkResult>>(networkApi.details)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const {
        No,
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

  // mutation for fetch certificate data from server and call download crt file
  const { trigger: certificateDownloadTrigger, isMutating: certificateDownloadLoading } =
    useSWRMutation(networkApi.certificate, fetcher, {
      onSuccess: (certificateData: string) => {
        downloadCertificateFile(certificateData)
      },
    })

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: certificateIcon,
      text: t`Upload CA-Certificate`,
      link: routeProperty.networkUploadCaCertificate.path(),
      disabled: formData?.SelfSigned?.value === '1',
    },
    {
      color: 'danger',
      icon: certificateDownloadIcon,
      text: t`Download Certificate for PC`,
      onClick: () => {
        certificateDownloadTrigger()
      },
      isLoading: certificateDownloadLoading,
      disabled: formData?.SelfSigned?.value === '0',
    },
  ]

  const breadcrumbsActionsButtons: IActionsButton[] = [
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.networkEdit.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        // breadcrumbs navbar & router link
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.networkInfo.path(),
            text: t`Network`,
          },
          {
            href: routeProperty.networkInfo.path(),
            text: t`Information`,
          },
        ]}
        //end --rubel
      />
      <div className="pt-2" />
      <FormContainer sameHeight twoPart={false}>
        <NetworkForm formData={formData} isLoading={isLoading} />
        <NetworkCertificateForm formData={formData} isLoading={isLoading} />
        <NetworkMasterForm formData={formData} isLoading={isLoading} />
        <NetworkCloudForm formData={formData} isLoading={isLoading} />
        <NetworkWifiForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default NetworkInfo
