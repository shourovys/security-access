import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { timeApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TimeForm from '../../components/pages/time/TimeForm'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../types/pages/common'
import { ITimeFormData, ITimeResult } from '../../types/pages/time'
import { findSelectOptionOrDefault } from '../../utils/findSelectOption'
import { htmlInputDatetimeFormatter } from '../../utils/formetTime'
import { editIcon } from '../../utils/icons'
import t from '../../utils/translator'

// Component to show details of time
function TimeInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<ITimeFormData>({
    Timezone: null,
    Ntp: null,
    CurrentTime: '',
  })

  // Fetch the details of the Time from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ITimeResult>>(timeApi.details)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Timezone, Ntp, CurrentTime, CurrentTimeZone } = data.data
      setFormData({
        Timezone: {
          label: Timezone,
          value: Timezone,
        },
        Ntp: findSelectOptionOrDefault(booleanSelectOption, Ntp),
        // CurrentTime: formatDateForServer(CurrentTime ?? '').toString(),
        CurrentTime: htmlInputDatetimeFormatter(CurrentTime ?? ''),
      })
    }
  }, [data])

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.timeEdit.path(),
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
            href: routeProperty.timeInfo.path(),
            text: t`Time`,
          },
          {
            href: routeProperty.timeInfo.path(),
            text: t`Information`,
          },
        ]}
        //end --rubel
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <TimeForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default TimeInfo
