import { licenseApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import LicenseForm from '../../components/pages/license/LicenseForm'
import LicenseInformationForm from '../../components/pages/license/LicenseInformationForm'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import { IActionsButton } from '../../types/components/actionButtons'
import {
  booleanSelectObject,
  booleanSelectOption,
  ISingleServerResponse,
} from '../../types/pages/common'
import {
  ILicenseDetailsResult,
  ILicenseFormData,
  licenseModelsTypesOptions,
  licenseNodeTypesOptions,
  licenseProductsOptions,
} from '../../types/pages/license'
import { findSelectOption } from '../../utils/findSelectOption'
import { capacityIcon, editIcon } from '../../utils/icons'
import t from '../../utils/translator'

// Component to show details of license
function LicenseInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<ILicenseFormData>({
    Key: '',
    NodeType: licenseNodeTypesOptions[0],
    Elevator: null,
    Mac: '',
    Product: '',
    Model: '',
    Type: '',
    Options: '',
    OptionsStr: '',
    Oem: '',
    Camera: '',
    Channel: '',
    Lockset: '',
    Facegate: '',
    Subnode: '',
    ContLock: '',
    Intercom: '',
    Licensed: '',
    Eula: '',
  })

  // Fetch the details of the License from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ILicenseDetailsResult>>(
    licenseApi.details
  )

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const {
        Key,
        NodeType,
        Elevator,
        Mac,
        Product,
        Model,
        Type,
        Options,
        OptionsStr,
        OemName,
        Camera,
        Channel,
        Lockset,
        Facegate,
        Subnode,
        ContLock,
        Intercom,
        Licensed,
        Eula,
      } = data.data.License

      setFormData({
        Key,
        NodeType: findSelectOption(licenseNodeTypesOptions, NodeType),
        Elevator: findSelectOption(booleanSelectOption, Elevator),
        Mac,
        Product:
          licenseProductsOptions.find((option) => option.value === Product.toString())?.label || '',
        Model:
          licenseModelsTypesOptions.find((option) => option.value === Model.toString())?.label ||
          '',
        Type: Type.toString(),
        Options,
        OptionsStr,
        Oem: OemName,
        Camera: Camera.toString(),
        Channel: Channel.toString(),
        Lockset: Lockset.toString(),
        Facegate: Facegate.toString(),
        Subnode: Subnode.toString(),
        ContLock: ContLock.toString(),
        Intercom: Intercom.toString(),
        Licensed: booleanSelectObject[Licensed],
        Eula: booleanSelectObject[Eula],
      })
    }
  }, [data])

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: capacityIcon,
      text: t`Capacity`,
      link: routeProperty.licenseCapacity.path(),
    },
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.licenseEdit.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        // breadcrumbs navbar & router link
        pageRoutes={[
          {
            href: routeProperty.licenseInfo.path(),
            text: t`License`,
          },
          {
            href: routeProperty.licenseInfo.path(),
            text: t`Information`,
          },
        ]}
        // --rubel
      />
      {/* <div className="pt-2" /> */}
      <FormContainer sameHeight twoPart={false}>
        <LicenseForm formData={formData} isLoading={isLoading} />
        <LicenseInformationForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default LicenseInfo
