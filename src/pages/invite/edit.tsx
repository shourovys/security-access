import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { inviteApi } from '../../api/urls/serviceUrls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import InviteAccessForm from '../../components/pages/invite/InviteAccessForm'
import InviteForm from '../../components/pages/invite/InviteForm'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  accessSelectOption,
  booleanSelectOption,
} from '../../types/pages/common'
import { IInviteFormData, IInviteResult } from '../../types/pages/invite'
import { findSelectOption } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

function EditInvite() {
  const navigate = useNavigate()

  useBeforeunload(() => t('You will lose your changes!'))

  const [formData, setFormData] = useState<IInviteFormData>({
    Enable: null,
    Format: null,
    MaxTime: '',
    MaxCount: '',
    InviteAccess: null,
    AccessSelect: null,
    AccessIds: [],
    GroupIds: [],
  })

  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  const { isLoading, data } = useSWR<ISingleServerResponse<IInviteResult>>(inviteApi.details)
  useEffect(() => {
    if (data) {
      const { Enable, MaxTime, AccessSelect, Accesses, Groups, Format, MaxCount, InviteAccess } =
        data.data

      setFormData((state) => ({
        ...state,
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
        AccessIds: Accesses?.map((item) => item.AccessNo.toString()) || [],
        GroupIds: Groups?.map((item) => item.GroupNo.toString()) || [],
      }))
    }
  }, [data])

  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: '' })
  }

  const { trigger, isMutating } = useSWRMutation(inviteApi.edit, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.inviteInfo.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  const handleSubmit = async () => {
    const errors: IFormErrors = {}
    if (formData.Enable?.value === '1') {
      if (formData.Enable.value === '1' && !formData.Format?.value) {
        errors.Format = t('This field is required')
      }
      if (formData.Enable.value === '1' && !formData.MaxTime) {
        errors.MaxTime = t('This field is required')
      }
      // if (formData.Enable.value === '1' && !formData.AccessSelect?.value) {
      //   errors.AccessSelect = t('This field is required')
      // }
    }
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    const modifiedFormData = {
      Enable: Number(formData.Enable?.value),
      FormatNo: Number(formData.Format?.value),
      MaxTime: Number(formData.MaxTime),
      MaxCount: Number(formData.MaxCount),
      InviteAccess: Number(formData.InviteAccess?.value),
      AccessSelect: Number(formData.AccessSelect?.value),
      AccessIds: formData.AccessIds,
      GroupIds: formData.GroupIds,
    }
    trigger(modifiedFormData)
  }

  const breadcrumbsActionsButtons: IActionsButton[] = [
    {
      color: 'apply',
      icon: applyIcon,
      text: t`Apply`,
      onClick: handleSubmit,
      disabled: isMutating,
    },
    {
      color: 'cancel',
      icon: cancelIcon,
      text: t`Cancel`,
      link: routeProperty.inviteInfo.path(),
    },
  ]

  return (
    <Page>
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        pageRoutes={[
          {
            href: routeProperty.inviteEdit.path(),
            text: t`Invite`,
          },
          {
            href: routeProperty.inviteEdit.path(),
            text: t`Edit`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <InviteForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
        />
        {formData?.Enable?.value === '1' && (
          <InviteAccessForm
            formData={formData}
            formErrors={formErrors}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
          />
        )}
      </FormContainer>
    </Page>
  )
}

export default EditInvite
