import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { THandleInputSelect } from '../../types/components/common'
import { ERROR_CLASS, IMAGE_URL } from '../../utils/config'
import Icon, { cancelIcon } from '../../utils/icons'
import { Base64ImageUrl, convertImageToBase64, isBase64String } from '../../utils/imageBase64'
import t from '../../utils/translator'
import Modal from '../HOC/modal/Modal'
import ImageInputLoading from '../loading/atomic/ImageInputLoading'
import Checkbox from './Checkbox'

interface IProps {
  name: string
  label?: string
  value?: File | string | null | undefined
  placeholder?: string
  isLoading?: boolean
  helpText?: string
  error?: string | null
  onChange?: (name: string, value: string | null) => void
  disabled?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function ImageInput({
  name,
  label = '',
  value,
  placeholder = t('Select a photo'),
  isLoading,
  helpText,
  error,
  onChange,
  disabled = false,
  isSelected,
  handleSelect,
}: IProps) {
  const [previewSrc, setPreviewSrc] = useState<File | string | null | undefined>(value)
  const [showClearButton, setShowClearButton] = useState<boolean>(!!value)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file change event when a new file is selected
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const src = URL.createObjectURL(event.target.files[0])
      setPreviewSrc(src)
      setShowClearButton(true)

      if (onChange) {
        const base64Image = await convertImageToBase64(event.target.files[0])
        onChange(name, base64Image)
      }
    }
  }

  // Handle clear button click event to reset the preview and clear the file input
  const handleClearClick = () => {
    setPreviewSrc(null)
    setShowClearButton(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    if (onChange) {
      onChange(name, null)
    }
  }

  // Update the preview and clear button based on the initial value
  useEffect(() => {
    if (value && typeof value === 'string') {
      setPreviewSrc(value)
      setShowClearButton(true)
    }
  }, [value])

  // Check if the preview source is a server URL (not a base64 string)
  const isServerUrl = previewSrc && !isBase64String(value)

  return (
    <div className="space-y-0.5 min-w-max w-full">
      {label && (
        <>
          {handleSelect ? (
            // Render checkbox if handleSelect prop is provided
            <div className="py-0.5">
              <Checkbox
                label={label}
                value={name}
                checked={isSelected}
                onChange={(checked) => {
                  handleSelect(name, checked)
                }}
              />
            </div>
          ) : (
            // Render label element
            <label className="inline-block w-full text-sm text-gray-700 form-label" htmlFor={name}>
              {label}
            </label>
          )}
        </>
      )}
      {isLoading ? (
        // Render loading state component
        <ImageInputLoading />
      ) : (
        <div className="relative flex items-center justify-center w-auto max-w-min">
          <label
            htmlFor={name}
            className={classNames(
              'flex flex-col h-[106px] border-4 border-dashed  w-[250px] rounded-md cursor-pointer',
              disabled ? '' : ' hover:bg-gray-100 hover:border-gray-300',
              error && ERROR_CLASS
            )}
          >
            <div className="relative flex flex-col items-center justify-center pt-2">
              {!isServerUrl && previewSrc && typeof previewSrc === 'string' && (
                // Render image preview using Base64ImageUrl
                <img
                  id="preview"
                  onClick={() => disabled && setShowPreview(true)}
                  className="absolute inset-0 w-full h-[98px] object-contain"
                  src={Base64ImageUrl(previewSrc)}
                  alt=""
                />
              )}
              {isServerUrl && (
                // Render image preview with server image URL
                <img
                  id="preview"
                  onClick={() => disabled && setShowPreview(true)}
                  className="absolute inset-0 w-full h-[98px] object-contain"
                  src={IMAGE_URL + previewSrc}
                  // src={Base64ImageUrl(previewSrc as string)}
                  alt=""
                />
              )}
              {!previewSrc && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    {placeholder}
                  </p>
                </>
              )}
            </div>
            <input
              id={name}
              type="file"
              ref={fileInputRef}
              className="opacity-0 -z-10"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled}
            />
            {showClearButton && !disabled && (
              // Render clear button to remove selected image
              <button
                className={classNames(
                  'absolute z-20 items-center justify-center w-7 h-7 text-white bg-gray-600 border-2 shadow border-gray-50 rounded-full cursor-pointer top-1 right-0'
                )}
                onClick={(e) => {
                  e.preventDefault()
                  handleClearClick()
                }}
                title={t`Menu colups button`}
              >
                <Icon icon={cancelIcon} className="text-base" />
              </button>
            )}
          </label>
        </div>
      )}
      <Modal openModal={showPreview} setOpenModal={setShowPreview}>
        <div className="w-fit relative h-fit flex items-center justify-center">
          {!isServerUrl && previewSrc && typeof previewSrc === 'string' && (
            // Render image preview using Base64ImageUrl
            <img
              id="preview"
              className="w-full h-[60vh] object-contain"
              src={Base64ImageUrl(previewSrc)}
              alt=""
            />
          )}
          {isServerUrl && (
            // Render image preview with server image URL
            <img
              onClick={() => setShowPreview(true)}
              id="preview"
              className={classNames('w-full h-[60vh] object-contain', '')}
              src={IMAGE_URL + previewSrc}
              // src={Base64ImageUrl(previewSrc as string)}
              alt=""
            />
          )}
          <button
            className={classNames(
              'absolute z-20 items-center justify-center w-7 h-7 text-white bg-gray-600 border-2 shadow border-gray-50 rounded-full cursor-pointer top-1 right-1 outline-none'
            )}
            onClick={() => setShowPreview(false)}
            title={t`Menu colups button`}
          >
            <Icon icon={cancelIcon} className="text-base" />
          </button>
        </div>
      </Modal>
      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default ImageInput
