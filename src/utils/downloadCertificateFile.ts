const downloadCertificateFile = (certificateData: string) => {
  // Create a Blob from the certificate data
  const blob = new Blob([certificateData], { type: 'application/x-x509-ca-cert' })

  // Create a download link
  const downloadLink = document.createElement('a')
  downloadLink.href = URL.createObjectURL(blob)

  // Set the filename for the download link
  downloadLink.download = 'selfca.crt'

  // Append the download link to the document and trigger the click event
  document.body.appendChild(downloadLink)
  downloadLink.click()

  // Clean up the URL object and the download link
  URL.revokeObjectURL(downloadLink.href)
  document.body.removeChild(downloadLink)
}

export default downloadCertificateFile
