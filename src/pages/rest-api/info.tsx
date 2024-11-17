import { restApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import RestApiForm from '../../components/pages/restApi/RestApiForm'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../types/pages/common'
import { IRestApiFormData, IRestApiResult } from '../../types/pages/restApi'
import { findSelectOption } from '../../utils/findSelectOption'
import { editIcon } from '../../utils/icons'
import t from '../../utils/translator'

// Component to show details of restApi
function RestApiInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IRestApiFormData>({
    Enable: null,
    ApiKey: '',
  })

  // Fetch the details of the RestApi from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IRestApiResult>>(restApi.details)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Enable, ApiKey } = data.data
      setFormData({
        Enable: findSelectOption(booleanSelectOption, Enable),
        ApiKey,
      })
    }
  }, [data])

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.restApiEdit.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.restApiInfo.path(),
            text: t`REST API`,
          },
          {
            href: routeProperty.restApiInfo.path(),
            text: t`Information`,
          },
        ]}
        pageTitle="REST API"
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <RestApiForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default RestApiInfo
