import { AxiosError } from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../../../api/swrConfig'
import { credentialApi, formatApi } from '../../../../api/urls'
import Button from '../../../../components/atomic/Button'
import FormActionButtonsContainer from '../../../../components/HOC/style/form/FormActionButtonsContainer'
import FormContainer from '../../../../components/HOC/style/form/FormContainer'
import { useDefaultDoorOption } from '../../../../hooks/useDefaultOption'
import useStateWithCallback from '../../../../hooks/useStateWithCallback'
import { THandleInputChange } from '../../../../types/components/common'
import {
  ICommandResponse,
  IListServerResponse,
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerCommandResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../../types/pages/common'
import {
  ICredentialFormData,
  ICredentialScanFormData,
  ICredentialScanResult,
} from '../../../../types/pages/credential'
import { IFormatFormData, IFormatResult } from '../../../../types/pages/format'
import { binaryToDecimal, getValidSubBinary } from '../../../../utils/binaryToDecimal'
import { SERVER_QUERY } from '../../../../utils/config'
import Icon, { applyIcon, cancelIcon, stopIcon } from '../../../../utils/icons'
import scrollToErrorElement from '../../../../utils/scrollToErrorElement'
import { addSuccessfulToast, editSuccessfulToast, warningToast } from '../../../../utils/toast'
import t from '../../../../utils/translator'
import CredentialScanForm from './CredentialScanForm'

interface IPropsBase {
  setOpenModal: (openModal: boolean) => void
}

interface IPropsWithCredential extends IPropsBase {
  setCredentialFormData: React.Dispatch<React.SetStateAction<ICredentialFormData>>
  setFormatFormData?: never
  setOpenModal: (openModal: boolean) => void
  modelTitle?: string
}

interface IPropsWithFormat extends IPropsBase {
  setCredentialFormData?: never
  setFormatFormData: React.Dispatch<React.SetStateAction<IFormatFormData>>
  setOpenModal: (openModal: boolean) => void
  modelTitle?: string
}

type IProps = IPropsWithCredential | IPropsWithFormat

const CredentialScanModal = ({
  setCredentialFormData,
  setFormatFormData,
  setOpenModal,
  modelTitle,
}: IProps) => {
  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<ICredentialScanFormData>({
    Door: null,
    Status: '',
    CurrentTime: '',
    isScanning: false,
  })

  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<ICredentialScanFormData>>(
    {},
    scrollToErrorElement
  )

  // define the ref for store interval ID
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null)

  // Set default Partition and Schedule
  useDefaultDoorOption<ICredentialScanFormData>(setFormData)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  const { data: formatData } = useSWR<IListServerResponse<IFormatResult[]>>(
    formatApi.list(SERVER_QUERY.selectorDataQuery)
  )

  // Define the mutation function to send the form data to the server
  const { trigger: getScanDataTrigger } = useSWRMutation(credentialApi.scanData, sendPostRequest, {
    onSuccess: ({
      success,
      data,
      cgi: { success: cgiSuccess, data: cgiData, errors },
    }: IServerCommandResponse<ICredentialScanResult>) => {
      if (success) {
        const scanFormatObject = formatData?.data.find(
          (format) => format.FormatNo.toString() === data.FormatNo
        )
        addSuccessfulToast(`Success`)

        if (setCredentialFormData) {
          setCredentialFormData((state) => ({
            ...state,
            Format: scanFormatObject
              ? {
                  label: scanFormatObject.FormatName,
                  value: scanFormatObject.FormatNo.toString(),
                }
              : state.Format,
            CredentialNumb: data?.CredentialNumb || state.CredentialNumb,
          }))
        }

        if (setFormatFormData) {
          setFormatFormData((state) => {
            const scanFormatState: Partial<IFormatFormData> = {
              CardData: data?.CardData || state.CardData,
              TotalLength: data?.CardData?.toString().length.toString() || state.TotalLength,
              FacilityCode: state.FacilityCode,
              CardNumber: state.CardNumber,
            }

            const facilityStart = Number(state.FacilityStart)
            const facilityLength = Number(state.FacilityLength)
            const cardData = data?.CardData

            if (facilityStart >= 0 && facilityLength > 0 && typeof cardData === 'string') {
              const validSubBinary = getValidSubBinary(cardData, facilityStart, facilityLength)
              if (validSubBinary) {
                const facilityCode = binaryToDecimal(validSubBinary)
                scanFormatState.FacilityCode = facilityCode.toString()
              }
            }

            const numberStart = Number(state.NumberStart)
            const numberLength = Number(state.NumberLength)

            if (numberStart >= 0 && numberLength > 0 && typeof cardData === 'string') {
              const validSubBinary = getValidSubBinary(cardData, numberStart, numberLength)
              if (validSubBinary) {
                const cardNumber = binaryToDecimal(validSubBinary)
                scanFormatState.CardNumber = cardNumber.toString()
              }
            }

            return { ...state, ...scanFormatState } as IFormatFormData
          })
        }

        setOpenModal(false)
        handelScanStop()
      } else {
        getScanDataTrigger({
          CurrentTime: formData.CurrentTime,
          DoorNo: formData.Door?.value,
        })
      }
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      // if (formData.isScanning) {
      //   // if error then also call mutation
      //   getScanDataTrigger({ CurrentTime: formData.CurrentTime, DoorNo: formData.Door?.value })
      // }
      // serverErrorHandler(error, setFormErrors)
    },
  })

  // Define the mutation function to start credential scan
  const { trigger: startCredentialScanTrigger, isMutating: isStartCredentialScanMutating } =
    useSWRMutation(credentialApi.scan, sendPostRequest, {
      onSuccess: ({
        data: { CurrentTime },
        cgi,
      }: IServerCommandResponse<{
        CurrentTime: string
      }>) => {
        if (cgi.success) {
          editSuccessfulToast('Scan Stated')
          handleInputChange('CurrentTime', CurrentTime)
          handleInputChange('isScanning', true)
        } else {
          warningToast(cgi.errors)
        }
      },
    })

  // Define the mutation function to stop credential scan
  const { trigger: stopCredentialScanTrigger, isMutating: isStopCredentialScanMutating } =
    useSWRMutation(credentialApi.scan, sendPostRequest, {
      onSuccess: ({
        cgi,
      }: IServerCommandResponse<{
        CurrentTime: string
      }>) => {
        if (cgi.success) {
          addSuccessfulToast(`Scan stop`)
        } else {
          warningToast(cgi.errors)
        }
      },
    })

  const handelScanStop = () => {
    if (formData.isScanning) {
      setFormData((state) => ({ ...state, isScanning: false, CurrentTime: '', Status: '' }))
      stopCredentialScanTrigger({
        // if you need to call this mutaion for stop server scanning. create a same mutation and use hear
        DoorNo: formData.Door?.value,
        Active: '0',
      })
      if (intervalIdRef.current) clearInterval(intervalIdRef.current)
    }
  }

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: INewFormErrors<ICredentialScanFormData> = {}

    if (!formData.Door?.value) {
      errors.Door = t`Door is required`
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      // error_toast
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      DoorNo: formData.Door?.value,
      Active: '1',
    }

    startCredentialScanTrigger(modifiedFormData)
  }

  useEffect(() => {
    // Schedule subsequent API requests every 10 seconds
    if (formData.isScanning) {
      getScanDataTrigger({ CurrentTime: formData.CurrentTime, DoorNo: formData.Door?.value })

      intervalIdRef.current = setInterval(() => {
        setFormData((prevState) => ({
          ...prevState,
          Status: (Number(prevState.Status) + 1).toString(),
        }))
        getScanDataTrigger({ CurrentTime: formData.CurrentTime, DoorNo: formData.Door?.value })
      }, 1000)
    }
  }, [formData.CurrentTime, formData.isScanning])

  useEffect(() => {
    if (Number(formData.Status) >= 30) {
      handelScanStop()
    }
  }, [formData.Status])

  const handleCloseModal = () => {
    handelScanStop()
    setOpenModal(false)
  }

  return (
    <div className="w-full px-4 pt-4 bg-white rounded-md">
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <CredentialScanForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          modelTitle={modelTitle}
        />
        {/*progress bar*/}
        {formData.isScanning && (
          <div className="px-4">
            <div className="flex items-center w-full h-2 mt-4 bg-gray-100 rounded-md">
              <div
                className="h-2 bg-green-500 rounded-md transition-all duration-1000 ease-in-out"
                style={{ width: `${100 - (Number(formData.Status) / 29) * 100}%` }}
              />
            </div>
          </div>
        )}
      </FormContainer>
      <FormActionButtonsContainer allowsShow>
        {formData.isScanning ? (
          <Button size="base" onClick={handelScanStop} isLoading={isStopCredentialScanMutating}>
            <Icon icon={stopIcon} />
            <span>Stop</span>
          </Button>
        ) : (
          <Button size="base" onClick={handleSubmit} isLoading={isStartCredentialScanMutating}>
            <Icon icon={applyIcon} />
            <span>Start</span>
          </Button>
        )}
        <Button size="base" color="cancel" onClick={handleCloseModal}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer>
    </div>
  )
}

export default CredentialScanModal
