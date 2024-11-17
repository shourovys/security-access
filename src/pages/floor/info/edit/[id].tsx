import { sendPostRequest } from '../../../../api/swrConfig'
import { floorApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Page from '../../../../components/HOC/Page'
import FormContainer from '../../../../components/HOC/style/form/FormContainer'
import MultiSelect from '../../../../components/common/form/MultiSelect'
import Breadcrumbs from '../../../../components/layout/Breadcrumbs'
import { useElementSelectData } from '../../../../hooks/useSelectData'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import routeProperty from '../../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../../types/components/actionButtons'
import { IFormErrors, ISingleServerResponse } from '../../../../types/pages/common'
import { IFloorElementsType, IFloorResult } from '../../../../types/pages/floor'
import { applyIcon, cancelIcon, floorIcon } from '../../../../utils/icons'
import { addSuccessfulToast } from '../../../../utils/toast'
import t from '../../../../utils/translator'

// Component to add elements of a floor
function EditFloorInfo() {
  const navigate = useNavigate()
  // Get the floor ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  // const { openAlertDialogWithPromise } = useAlert()
  // Get the edit element type from the router query
  const [searchParams] = useSearchParams()
  const elementType = searchParams.get('type') as IFloorElementsType

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<string[]>([])

  // Fetch the elements of the Floor from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IFloorResult>>(
    queryId && elementType ? floorApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      setFormData(data.data.Items[elementType].map((item) => item.No?.toString()))
    }
  }, [data])

  // Fetch elements by type from the server
  const { isLoading: elementsLoading, data: elementsData } = useElementSelectData(
    !queryId && !elementType,
    elementType
  )
  // const { isLoading: elementsLoading, data: elementsData } = useSWR<
  //   IListServerResponse<INewElementsResult[]>
  // >(queryId && elementType ? ElementsApi.list(`type=${elementType}`) : null)

  // Update the form data when any input changes
  const handleInputChange = (name: string, value: string[]) => {
    setFormData(value)
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(
    floorApi.addElements(queryId, elementType),
    sendPostRequest,
    {
      onSuccess: () => {
        addSuccessfulToast()
        // redirect to floor list page on success
        navigate(routeProperty.floorInfo.path(queryId))
      },
    }
  )

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    // const errors: IFormErrors = {}
    // if (!formData.length) {
    //   errors.elements = t`No Item in right side`
    // }

    // If there are errors, display them and do not submit the form
    // if (Object.keys(errors).length) {
    //   // setFormErrors(errors);
    //   //Object.entries(errors).forEach(([, value]) => {
    //   //   if (value) {
    //   //     errorToast(value)
    //   //   }
    //   // })
    //   return
    // }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      DeviceType: elementType,
      DeviceNos: formData,
    }

    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActionsButtons: IActionsButton[] = [
    {
      color: 'apply',
      icon: applyIcon,
      text: t`Apply`,
      onClick: handleSubmit,
      isLoading: isMutating,
    },
    {
      color: 'cancel',
      icon: cancelIcon,
      text: t`Cancel`,
      link: routeProperty.floorInfo.path(queryId),
    },
  ]

  return (
    <Page title={t('Edit Floor') + ' ' + t(elementType)}>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        pageRoutes={[
          {
            href: '/floor',
            text: t`Floor`,
          },
          {
            href: `/floor/info/${queryId}`,
            text: t`Information`,
          },
          {
            href: '#',
            // href: router.asPath,
            text: t`Edit`,
          },
        ]}
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <FormCardWithHeader icon={floorIcon} header={`Floor ${t(elementType)}`} twoPart={true}>
          <MultiSelect
            name="elements"
            value={formData}
            onChange={handleInputChange}
            options={elementsData?.data.map((item) => ({
              id: item.No.toString(),
              label: item.Name,
            }))}
            isLoading={isLoading || elementsLoading}
            gridColSpan2
          />
        </FormCardWithHeader>
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.floorInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditFloorInfo
