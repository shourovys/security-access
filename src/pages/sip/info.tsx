import { sipApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import SipForm from '../../components/pages/sip/SipForm'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../types/pages/common'
import { ISipFormData, ISipResult } from '../../types/pages/sip'
import { findSelectOption } from '../../utils/findSelectOption'
import { editIcon } from '../../utils/icons'
import t from '../../utils/translator'

// Component to show details of sip
function SipInfo() {
  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<ISipFormData>({
    Enable: null,
    ServerAddr: '',
    ServerPort: '',
    SipFieldNo: null,
  })

  // Fetch the details of the Sip from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ISipResult>>(sipApi.details)
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Enable, ServerAddr, ServerPort, SipFields } = data.data
      setFormData({
        Enable: findSelectOption(booleanSelectOption, Enable),
        ServerAddr,
        ServerPort: ServerPort.toString(),
        SipFieldNo: SipFields
          ? {
              value: SipFields?.FieldNo.toString(),
              label: SipFields?.FieldName,
            }
          : null,
      })
    }
  }, [data])

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.sipEdit.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.sipInfo.path(),
            text: 'SIP',
          },
          {
            href: routeProperty.sipInfo.path(),
            text: t`Information`,
          },
        ]}
        pageTitle="SIP"
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <SipForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default SipInfo
