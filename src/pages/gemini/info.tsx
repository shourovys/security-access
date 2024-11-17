import { geminiApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import GeminiForm from '../../components/pages/gemini/GeminiForm'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../types/pages/common'
import { IGeminiFormData, IGeminiResult } from '../../types/pages/gemini'
import { findSelectOption } from '../../utils/findSelectOption'
import { editIcon } from '../../utils/icons'
import t from '../../utils/translator'

// Component to show details of gemini
function GeminiInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IGeminiFormData>({
    Enable: null,
    SecuKey: '',
  })

  // Fetch the details of the Gemini from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IGeminiResult>>(geminiApi.details)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Enable, SecuKey } = data.data
      setFormData({
        Enable: findSelectOption(booleanSelectOption, Enable),
        SecuKey,
      })
    }
  }, [data])

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.geminiEdit.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.geminiInfo.path(),
            text: t`Gemini`,
          },
          {
            href: routeProperty.geminiInfo.path(),
            text: t`Information`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <GeminiForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default GeminiInfo
