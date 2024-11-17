import { ChangeEvent, ReactNode, useRef } from 'react'

interface FileUploaderProps {
  accept?: string
  handleFile: (file: File) => void
  children: ReactNode
  disabled?: boolean
}

const ButtonWithFileUpload = ({ accept, handleFile, children, disabled }: FileUploaderProps) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files?.[0]
    if (fileUploaded) {
      handleFile(fileUploaded)
    }
  }

  if (disabled) {
    return <div>{children}</div>
  }

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        accept={accept}
        style={{ display: 'none' }}
      />
    </>
  )
}

export default ButtonWithFileUpload
