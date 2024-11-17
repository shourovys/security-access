import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../../api/swrConfig'
import { licenseApi } from '../../../api/urls'
import FormActionButtonsContainer from '../../../components/HOC/style/form/FormActionButtonsContainer'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Button from '../../../components/atomic/Button'
import useLogoutMutation from '../../../hooks/useLogoutMutation'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { THandleInputChange } from '../../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../types/pages/common'
import { ILicenseCustomerUpdateFormData } from '../../../types/pages/license'
import Icon, { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'
import LicenseCustomerForm from './LicenseCustomerForm'

interface IProps {
  setOpenModal: (openModal: boolean) => void
  submitLicenseData: (submitCustomerModal?: () => void) => void
  isLicenseEditMutate: boolean
  handleCustomerNotFound: () => void
}

const LicenseCustomerUpdateModal = ({
  setOpenModal,
  submitLicenseData,
  isLicenseEditMutate,
  handleCustomerNotFound,
}: IProps) => {
  // Define the mutation function logout user and navigate to login page
  const { isLogoutLoading } = useLogoutMutation()

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<ILicenseCustomerUpdateFormData>({
    FirstName: '',
    LastName: '',
    Company: '',
    Email: '',
    Phone: '',
    Address: '',
    InstallType: '',
    Suggestion: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  const { data: customerData, isLoading: customerDataLoading } = useSWR<
    ISingleServerResponse<ILicenseCustomerUpdateFormData>
  >(licenseApi.getCustomer, {
    onError: () => {
      handleCustomerNotFound()
    },
  })

  useEffect(() => {
    if (customerData) {
      setFormData(customerData.data)
    }
  }, [customerDataLoading, customerData])

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(licenseApi.updateCustomer, sendPostRequest, {
    onSuccess: () => {
      // console.log('two success')
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = {}

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      //Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value)
      //   }
      // })
      return
    }

    submitLicenseData(() => trigger(formData))
  }

  return (
    <div className="w-full px-4 pt-4 bg-white rounded-md">
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <LicenseCustomerForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={customerDataLoading}
          disabled={isMutating || isLogoutLoading || isLicenseEditMutate}
        />
      </FormContainer>
      <FormActionButtonsContainer allowsShow>
        <Button
          size="large"
          onClick={handleSubmit}
          isLoading={isMutating || isLogoutLoading || isLicenseEditMutate}
        >
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" onClick={() => setOpenModal(false)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer>
    </div>
  )
}

export default LicenseCustomerUpdateModal
