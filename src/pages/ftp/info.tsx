import { sendPostRequest } from '../../api/swrConfig'
import { ftpApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import FtpForm from '../../components/pages/ftp/FtpForm'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../types/pages/common'
import { IFtpFormData, IFtpResult } from '../../types/pages/ftp'
import { findSelectOption } from '../../utils/findSelectOption'
import { editIcon, testIcon } from '../../utils/icons'
import { editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to show details of ftp
function FtpInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IFtpFormData>({
    Enable: null,
    ServerAddr: '',
    ServerPort: '',
    UserId: '',
    Password: '',
    Path: '',
  })

  // Fetch the details of the Ftp from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IFtpResult>>(ftpApi.details)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Enable, ServerAddr, ServerPort, UserId, Password, Path } = data.data
      setFormData({
        Enable: findSelectOption(booleanSelectOption, Enable),
        ServerAddr,
        ServerPort: ServerPort.toString(),
        UserId,
        Password,
        Path,
      })
    }
  }, [data])

  // Define the mutation function to test ftp
  const { trigger, isMutating } = useSWRMutation(ftpApi.test, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast(`Success`)
    },
  })

  // Handle the ftp test
  const handleTest = async () => {
    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      Enable: Number(formData.Enable?.value),
      ServerAddr: formData.ServerAddr,
      ServerPort: Number(formData.ServerPort),
      UserId: formData.UserId,
      Password: formData.Password,
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
      link: routeProperty.ftpEdit.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.ftpInfo.path(),
            text: t`FTP`,
          },
          {
            href: routeProperty.ftpInfo.path(),
            text: t`Information`,
          },
        ]}
        pageTitle="FTP"
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <FtpForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default FtpInfo
