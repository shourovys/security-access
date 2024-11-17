import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { favoriteApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import useAuth from '../../hooks/useAuth'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { MultiSelectOption } from '../../reducer/multiSelectReducer'
import { IActionsButton } from '../../types/components/actionButtons'
import { LicenseCheckType } from '../../types/context/auth'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../types/pages/common'
import { IFavoriteFormData, IFavoriteResult, IPageInfo } from '../../types/pages/favorite'
import { applyIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to edit a Favorite
function EditFavorite() {
  const navigate = useNavigate()
  const { permissions, license, has_license } = useAuth()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IFavoriteFormData>({
    PageIds: [],
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Favorite from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IFavoriteResult[]>>(favoriteApi.list)

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { data: favoriteData } = data

      const accessible_pages: { [k: number]: boolean } = permissions.reduce(
        (acc, { id, access }) => {
          const map: { [PageNo: number]: LicenseCheckType } = {
            3: 'Channel',
            4: 'Camera',
            22: 'Camera',
            23: 'Channel',
            24: 'Channel',
            25: 'Lockset',
            26: 'Lockset',
            60: 'Facegate',
            63: 'Subnode',
            64: 'Subnode',
            65: 'ContLock',
            66: 'ContLock',
            69: 'Intercom',
          }
          const option_map: { [PageNo: number]: number } = {
            37: 0,
            36: 1,
            61: 2,
            67: 3,
            68: 4,
          }

          if (access) {
            if (license && option_map[id] !== undefined) {
              return {
                ...acc,
                [id]: license.Options[option_map[id]] === '1',
              }
            }

            if (map[id]) {
              return {
                ...acc,
                [id]: has_license(map[id]),
              }
            }
          }

          return {
            ...acc,
            [id]: access,
          }
        },
        {}
      )

      const PageIds = favoriteData
        .filter((item) => accessible_pages[item.PageNo])
        .map(({ Page: _page }: { Page: IPageInfo }) => ({
          id: _page.PageNo.toString(),
          label: _page.PageName,
        }))

      // setFormData({
      //   PageIds: PageIds,
      // })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: (name: string, value: MultiSelectOption[]) => void = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(favoriteApi.edit, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      // navigate(routeProperty.favorite.path())/
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}

    if (formData.PageIds.length > 9) {
      errors.PageIds = t`You can choose max 10 pages as favorite`
    }

    // if (!formData.PageIds.length) {
    //   errors.PageIds = t`Favorite pages are required`
    // } else if (formData.PageIds.length > 9) {
    //   errors.PageIds = t`You can choose max 10 pages as favorite`
    // }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      // Object.entries(errors).forEach(([, value]) => {
      //     if (value) {
      //         errorToast(value);
      //     }
      // });
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    // const modifiedFormData = {
    //   PageIds: formData.PageIds.map((page) => page.id),
    // }

    // trigger(modifiedFormData)
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
    // {
    //   color: 'danger',
    //   icon: cancelIcon,
    //   text: t`Cancel`,
    //   link: routeProperty.favorite.path(),
    // },
  ]

  return (
    <Page>
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        pageRoutes={[
          {
            href: '/favorite',
            text: t`Favorite`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        {/* <FavoriteForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={isLoading}
        /> */}
        favorite
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="gray" link={routeProperty.favorite.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditFavorite
