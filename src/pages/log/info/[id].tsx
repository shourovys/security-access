import { homeApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { ILogFormData, ILogResult } from '../../../types/pages/log'
import { listIcon } from '../../../utils/icons'
import LogForm from '../../../components/pages/log/form/LogForm'
import t from '../../../utils/translator'

// Component to show details of a log
function LogInfo() {
  // Get the log ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // Get the Reference from the router query
  const [searchParams] = useSearchParams()
  const queryReference: string | null = searchParams.get('Reference')

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<ILogFormData>({
    LogNo: '',
    Partition: '',
    LogTime: 0,
    EventTime: 0,
    EventCode: '',
    EventName: '',
    DeviceType: '',
    DeviceNo: 0,
    PersonName: '',
    Message: '',
    DeviceName: '',
    FormatName: '',
    CredentialNumb: '',
    CredentialNo: 0,
    PersonNo: 0,
    ReaderPort: '',
    RegionName: '',
    ChannelName: '',
    AckRequired: false,
    AckTime: 0,
    AckUser: '',
    Comment: '',
    LogSent: '',
  })

  // Assuming queryId and queryReference are string | null
  const queryIdOrEmpty = queryId ?? ''
  const queryReferenceOrEmpty = queryReference ?? ''

  // Fetch the details of the Log from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ILogResult>>(
    !queryIdOrEmpty && !queryReferenceOrEmpty
      ? null
      : homeApi.logDetails(queryIdOrEmpty, queryReferenceOrEmpty)
  )
  useEffect(() => {
    if (data) {
      // Destructure data.data directly for a cleaner code
      const {
        LogNo,
        Partition,
        LogTime,
        EventTime,
        EventCode,
        EventName,
        DeviceType,
        PersonName,
        Message,
        DeviceName,
        Format,
        Credential,
        ReaderPort,
        Region,
        Channel,
        AckRequired,
        AckTime,
        AckUser,
        Comment,
        LogSent,
        CredentialNo,
        DeviceNo,
        PersonNo,
      } = data.data

      // Update the state using conditional checks for null values
      setFormData({
        CredentialNo,
        DeviceNo,
        PersonNo,
        LogNo: LogNo.toString(),
        Partition: Partition?.PartitionName || '',
        LogTime: LogTime,
        EventTime: EventTime,
        EventCode: EventCode.toString(),
        EventName,
        DeviceType: DeviceType.toString(),
        PersonName,
        Message,
        DeviceName: DeviceName || '',
        FormatName: Format?.FormatName || '',
        CredentialNumb: Credential?.CredentialName || '',
        ReaderPort: ReaderPort?.toString() || '',
        RegionName: Region?.RegionName || '',
        ChannelName: Channel?.ChannelName || '',
        AckRequired,
        AckTime,
        AckUser,
        Comment,
        LogSent: LogSent?.toString() || '',
      })
    }
  }, [data])

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: listIcon,
      text: t`List`,
      link: routeProperty.logReport.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        //// breadcrumbs navbar & router link
        pageRoutes={[
          {
            href: routeProperty.logReport.path(),
            text: t`Log`,
          },
          {
            href: routeProperty.logInfo.path(),
            text: t`Information`,
          },
        ]}
        //---end --rubel
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <LogForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default LogInfo
