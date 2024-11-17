// eslint-disable-next-line import/no-extraneous-dependencies
import { fromByteArray, toByteArray } from 'base64-js'

export function Base64ImageUrl(base64String: string): string {
  const isStringWithType = base64String.split(',')
  if (isStringWithType.length === 2) {
    if (!isBase64String(isStringWithType[1])) {
      // Invalid base64 string, return empty string
      return ''
    }
  }
  if (!isBase64String(base64String)) {
    // Invalid base64 string, return empty string
    return ''
  }
  return base64StringToImageUrl(base64String)
}

export function isBase64String(str: unknown): boolean {
  if (typeof str === 'string') {
    const isStringWithType = str.split(',')
    try {
      if (isStringWithType.length === 2) {
        const decodedBytes = toByteArray(isStringWithType[1])
        const encodedString = fromByteArray(decodedBytes)
        return encodedString === isStringWithType[1]
      }
      const decodedBytes = toByteArray(str)
      const encodedString = fromByteArray(decodedBytes)
      return encodedString === str
    } catch (error) {
      // If an error occurs during decoding, it is not a valid base64 string
      return false
    }
  } else {
    // Not a string, hence not a valid base64 string
    return false
  }
}

function base64StringToImageUrl(base64String: string): string {
  const isStringWithType = base64String.split(',')
  if (isStringWithType.length === 2) {
    const imageType = isStringWithType[0].split(':')[1].split(';')[0]
    const decodedBytes = toByteArray(isStringWithType[1])
    const arrayBuffer = new Uint8Array(decodedBytes).buffer
    const blob = new Blob([arrayBuffer], { type: `image/${imageType}` })
    return URL.createObjectURL(blob)
  }

  const decodedBytes = toByteArray(base64String)
  const arrayBuffer = new Uint8Array(decodedBytes).buffer
  const blob = new Blob([arrayBuffer], { type: 'image/png' })
  return URL.createObjectURL(blob)
}

export function convertImageToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    // Set up the onload event handler
    reader.onload = () => {
      const base64String = reader.result?.toString()
      if (base64String) {
        resolve(base64String)
      } else {
        reject(new Error('Failed to convert image to base64.'))
      }
    }

    // Set up the onerror event handler
    reader.onerror = (error) => {
      reject(error)
    }

    // Read the file as Data URL
    reader.readAsDataURL(file)
  })
}
