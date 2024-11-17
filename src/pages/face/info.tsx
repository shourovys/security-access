import { faceApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import FaceForm from '../../components/pages/face/FaceForm'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectOption } from '../../types/pages/common'
import { IFaceFormData, IFaceResult } from '../../types/pages/face'
import { findSelectOption } from '../../utils/findSelectOption'
import { editIcon } from '../../utils/icons'
import t from '../../utils/translator'

// Component to show details of face
function FaceInfo() {
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IFaceFormData>({
    Enable: null,
    ImagePath: '',
  })

  // Fetch the details of the Face from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IFaceResult>>(faceApi.details)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Enable, ImagePath } = data.data
      setFormData({
        Enable: findSelectOption(booleanSelectOption, Enable),
        ImagePath,
      })
    }
  }, [data])

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.faceEdit.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.faceInfo.path(),
            text: t`Face`,
          },
          {
            href: routeProperty.faceInfo.path(),
            text: t`Information`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <FaceForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default FaceInfo
