import { sendPostRequest } from '../../api/swrConfig'
import { emailApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import EmailForm from '../../components/pages/email/EmailForm'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../types/pages/common'
import { IEmailFormData, IEmailResult } from '../../types/pages/email'
import { findSelectOption } from '../../utils/findSelectOption'
import { editIcon, testIcon } from '../../utils/icons'
import { editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to show details of email
function EmailInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IEmailFormData>({
    Enable: null,
    ServerAddr: '',
    ServerPort: '',
    UserId: '',
    Password: '',
    Tls: null,
    Sender: '',
    Receiver: '',
  })

  // Fetch the details of the Email from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IEmailResult>>(emailApi.details)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Enable, ServerAddr, ServerPort, UserId, Password, Tls, Sender, Receiver } = data.data
      setFormData({
        Enable: findSelectOption(booleanSelectOption, Enable),
        ServerAddr,
        ServerPort: ServerPort.toString(),
        UserId,
        Password,
        Tls: findSelectOption(booleanSelectOption, Tls),
        Sender,
        Receiver,
      })
    }
  }, [data])

  // Define the mutation function to test email
  const { trigger, isMutating } = useSWRMutation(emailApi.test, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast(`Success`)
    },
  })

  // Handle the email test
  const handleTest = async () => {
    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      Enable: Number(formData.Enable?.value),
      ServerAddr: formData.ServerAddr,
      ServerPort: Number(formData.ServerPort),
      UserId: formData.UserId,
      Password: formData.Password,
      Tls: Number(formData.Tls?.value),
      Sender: formData.Sender,
      Receiver: formData.Receiver,
    }
    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: testIcon,
      text: t`Test`,
      onClick: handleTest,
      isLoading: isMutating,
      disabled: formData.Enable?.value === '0',
    },
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.emailEdit.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.emailInfo.path(),
            text: t`Email`,
          },
          {
            href: routeProperty.emailInfo.path(),
            text: t`Information`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <EmailForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default EmailInfo
