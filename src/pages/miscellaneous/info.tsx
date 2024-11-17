import { miscellaneousApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import MiscellaneousCredentialFormatForm from '../../components/pages/miscellaneous/MiscellaneousCredentialFormatForm'
import MiscellaneousDawnToDuskForm from '../../components/pages/miscellaneous/MiscellaneousDawnToDuskForm'
import MiscellaneousLanguageForm from '../../components/pages/miscellaneous/MiscellaneousLanguageForm'
import MiscellaneousTimeFormatForm from '../../components/pages/miscellaneous/MiscellaneousTimeFormatForm'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse } from '../../types/pages/common'
import {
  IMiscellaneousFormData,
  IMiscellaneousResult,
  LanguageOptions,
  bigEndianOptions,
  dateFormatOptions,
  timeFormatOptions,
} from '../../types/pages/miscellaneous'
import { findSelectOption } from '../../utils/findSelectOption'
import { editIcon } from '../../utils/icons'
import t from '../../utils/translator'

// Component to show details of miscellaneous
function MiscellaneousInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IMiscellaneousFormData>({
    Language: null,
    DateFormat: null,
    TimeFormat: null,
    Latitude: '',
    Longitude: '',
    BigEndian32: null,
    BigEndian56: null,
  })

  // Fetch the details of the Miscellaneous from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IMiscellaneousResult>>(
    miscellaneousApi.details
  )

  useEffect(() => {
    // check url to reload the page
    if (window.location.href.includes('reload')) {
      // remove get parameter from url
      window.location.href = window.location.href.split('?')[0]
    }
  }, [])

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Language, DateFormat, TimeFormat, Latitude, Longitude, BigEndian32, BigEndian56 } =
        data.data
      setFormData({
        Language: findSelectOption(LanguageOptions, Language),
        DateFormat: findSelectOption(dateFormatOptions, DateFormat),
        TimeFormat: findSelectOption(timeFormatOptions, TimeFormat),
        Latitude: Latitude.toString(),
        Longitude: Longitude.toString(),
        BigEndian32: findSelectOption(bigEndianOptions, BigEndian32),
        BigEndian56: findSelectOption(bigEndianOptions, BigEndian56),
      })
    }
  }, [data])

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.miscellaneousEdit.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.miscellaneousInfo.path(),
            text: t`Miscellaneous`,
          },
          {
            href: routeProperty.miscellaneousInfo.path(),
            text: t`Information`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer>
        <MiscellaneousLanguageForm formData={formData} isLoading={isLoading} />
        <MiscellaneousTimeFormatForm formData={formData} isLoading={isLoading} />
        <MiscellaneousDawnToDuskForm formData={formData} isLoading={isLoading} />
        <MiscellaneousCredentialFormatForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default MiscellaneousInfo
