import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { inviteApi } from '../../api/urls' // Check this import statement
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import InviteAccessForm from '../../components/pages/invite/InviteAccessForm'
import InviteForm from '../../components/pages/invite/InviteForm'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import {
  ISingleServerResponse,
  accessSelectOption,
  booleanSelectOption,
} from '../../types/pages/common'
import { IInviteFormData, IInviteResult } from '../../types/pages/invite'
import { findSelectOption } from '../../utils/findSelectOption'
import { editIcon } from '../../utils/icons'
import t from '../../utils/translator'

// Component to show details of invite
function InviteInfo() {
  const [formData, setFormData] = useState<IInviteFormData>({
    Enable: null,
    MaxTime: '',
    AccessSelect: null,
    AccessIds: [],
    GroupIds: [],
    Format: null,
    MaxCount: '',
    InviteAccess: null,
  })

  // Fetch the details of the Invite from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IInviteResult>>(inviteApi.details)
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Enable, MaxTime, AccessSelect, Accesses, Groups, Format, MaxCount, InviteAccess } =
        data.data
      setFormData({
        Enable: findSelectOption(booleanSelectOption, Enable),
        MaxTime: MaxTime.toString(),
        AccessSelect: findSelectOption(accessSelectOption, AccessSelect),
        Format: Format
          ? {
              value: Format.FormatNo.toString(),
              label: Format.FormatName,
            }
          : null,
        MaxCount: MaxCount.toString(),
        InviteAccess: findSelectOption(booleanSelectOption, InviteAccess),
        AccessIds: Accesses?.map((item) => item.AccessName.toString()) || [],
        GroupIds: Groups?.map((item) => item.GroupName.toString()) || [],
      })
    }
  }, [data])

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.inviteEdit.path(),
    },
  ]

  return (
    <Page>
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.inviteInfo.path(),
            text: t`Invite`,
          },
          {
            href: routeProperty.inviteInfo.path(),
            text: t`Information`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <InviteForm formData={formData} disabled={true} isLoading={isLoading} />
        {formData?.Enable?.value === '1' && (
          <InviteAccessForm formData={formData} disabled={true} isLoading={isLoading} />
        )}
      </FormContainer>
    </Page>
  )
}

export default InviteInfo
