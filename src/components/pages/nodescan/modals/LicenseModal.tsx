import { sendPostRequest } from '../../../../api/swrConfig'
import { nodeScanApi } from '../../../../api/urls'
import { AxiosError } from 'axios'
import FormActionButtonsContainer from '../../../../components/HOC/style/form/FormActionButtonsContainer'
import FormContainer from '../../../../components/HOC/style/form/FormContainer'
import Button from '../../../../components/atomic/Button'
import useStateWithCallback from '../../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import useSWRMutation from 'swr/mutation'
import { THandleInputChange } from '../../../../types/components/common'
import {
  ICommandResponse,
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  booleanSelectOption,
} from '../../../../types/pages/common'
import {
  licenseModelsTypesOptions,
  licenseNodeTypesOptions,
  licenseProductsOptions,
} from '../../../../types/pages/license'
import {
  INodeScanFormData,
  INodeScanLicenseFormData,
  INodeScanLicenseResult,
} from '../../../../types/pages/nodeScan'
import { findSelectOptionOrDefault } from '../../../../utils/findSelectOption'
import Icon, { applyIcon, cancelIcon } from '../../../../utils/icons'
import scrollToErrorElement from '../../../../utils/scrollToErrorElement'
import { addSuccessfulToast, editSuccessfulToast } from '../../../../utils/toast'
import serverErrorHandler from '../../../../utils/serverErrorHandler'
import t from '../../../../utils/translator'
import LicenseModalForm from './LicenseModalForm'

interface IProps {
  Macs: string[]
  loginInfo: INodeScanFormData
  licenseData: INodeScanLicenseResult | null
  isLoading?: boolean
  setOpenModal: (openModal: boolean) => void
}

const LicenseModal = ({ Macs, loginInfo, licenseData, isLoading, setOpenModal }: IProps) => {
  // const navigate = useNavigate()
  // const { openAlertDialog } = useAlert()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<INodeScanLicenseFormData>({
    Key: '',
    NodeType: licenseNodeTypesOptions[0],
    Elevator: null,
    Mac: '',
    Product: '',
    Model: '',
    Type: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (licenseData) {
      const { Key, NodeType, Elevator, Mac, Product, Model, Type } = licenseData

      setFormData({
        Key,
        NodeType: findSelectOptionOrDefault(licenseNodeTypesOptions, NodeType),
        Elevator: findSelectOptionOrDefault(booleanSelectOption, Elevator),
        Mac,
        Product:
          licenseProductsOptions.find((option) => option.value === Product.toString())?.label || '',
        Model:
          licenseModelsTypesOptions.find((option) => option.value === Model.toString())?.label ||
          '',
        Type: Type.toString(),
      })
    }
  }, [licenseData])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(nodeScanApi.setLicense, sendPostRequest, {
    onSuccess: () => {
      // editSuccessfulToast()
      addSuccessfulToast(`Success`)
      setOpenModal(false)
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.Key) {
      errors.Key = t`License key is required`
    }
    if (!formData.NodeType?.value) {
      errors.NodeType = t`Node Type is required`
    }

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

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      Mac: Macs[0],
      UserId: loginInfo.UserId,
      Password: loginInfo.Password,
      Key: formData.Key,
      NodeType: formData.NodeType?.value,
      Elevator: formData.Elevator?.value,
    }
    trigger(modifiedFormData)
  }

  // Define the mutation function to get license key state from the server
  const { trigger: getLicenseKeyTrigger, isMutating: getLicenseKeyLoading } = useSWRMutation(
    nodeScanApi.getLicenseKey,
    sendPostRequest,
    {
      onSuccess: (getLicenseData: ICommandResponse<{}[]>) => {
        // console.log(
        //   '🚀 ~ file: LicenseModal.tsx:136 ~ LicenseModal ~ getLicenseData:',
        //   getLicenseData
        // )
      },
    }
  )

  const handleGetLicenseKey = () => {
    getLicenseKeyTrigger({
      Mac: Macs[0],
      UserId: loginInfo.UserId,
      Password: loginInfo.Password,
    })
  }

  return (
    <div className="w-full px-4 pt-4 bg-white rounded-md">
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <LicenseModalForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      <FormActionButtonsContainer allowsShow>
        {/* TODO: need to work on get license key  */}
        {/* <Button
          size="base"
          color="danger"
          onClick={handleGetLicenseKey}
          isLoading={getLicenseKeyLoading}
        >
          <Icon icon={keyIcon} />
          <span>Get License Key</span>
        </Button> */}
        <Button size="base" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="base" color="cancel" onClick={() => setOpenModal(false)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer>
    </div>
  )
}

export default LicenseModal
