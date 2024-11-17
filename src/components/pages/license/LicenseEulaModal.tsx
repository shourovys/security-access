import CardModal from '../../../components/HOC/modal/CardModal'
import LicenseEula from '../../../components/pages/license/LicenseEula'
import useAuth from '../../../hooks/useAuth'
import { useState } from 'react'
import { licenseIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

const LicenseEulaModal = () => {
  const { license } = useAuth()

  // Define state variables for EULA modal
  const [openEulaModal, setOpenEulaModal] = useState(license?.Eula === 0)

  return (
    <CardModal
      icon={licenseIcon}
      headerTitle={t`License Agreement`}
      openModal={openEulaModal}
      setOpenModal={setOpenEulaModal}
      isCancelable={false}
    >
      <LicenseEula setOpenModal={setOpenEulaModal} />
    </CardModal>
  )
}

export default LicenseEulaModal
