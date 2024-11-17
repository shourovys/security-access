import { logApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import LogApiForm from '../../components/pages/logApi/LogApiForm'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../types/pages/common'
import { ILogApiFormData, ILogApiResult } from '../../types/pages/logApi'
import { findSelectOption } from '../../utils/findSelectOption'
import { editIcon } from '../../utils/icons'
import t from '../../utils/translator'

// Component to show details of logApi
function LogApiInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<ILogApiFormData>({
    Enable: null,
    EndPoint: '',
    UserId: '',
    Password: '',
    SiteId: '',
  })

  // Fetch the details of the LogApi from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ILogApiResult>>(logApi.details)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Enable, EndPoint, UserId, Password, SiteId } = data.data
      setFormData({
        Enable: findSelectOption(booleanSelectOption, Enable),
        EndPoint,
        UserId,
        Password,
        SiteId,
      })
    }
  }, [data])

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.logApiEdit.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.logApiInfo.path(),
            text: t`Log API`,
          },
          {
            href: routeProperty.logApiInfo.path(),
            text: t`Information`,
          },
        ]}
        pageTitle="Log API"
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <LogApiForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default LogApiInfo
