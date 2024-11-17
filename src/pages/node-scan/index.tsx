import { AxiosError } from 'axios'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { nodeScanApi } from '../../api/urls'
import TableAction from '../../components/common/table/TableAction'
import TableHeader from '../../components/common/table/TableHeader'
import TableNoData from '../../components/common/table/TableNoData'
import Modal from '../../components/HOC/modal/Modal'
import Page from '../../components/HOC/Page'
import Table from '../../components/HOC/style/table/Table'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TableBodyLoading from '../../components/loading/table/TableBodyLoading'
import LicenseModal from '../../components/pages/nodescan/modals/LicenseModal'
import MaintenanceModal from '../../components/pages/nodescan/modals/MaintenanceModal'
import NetworkModal from '../../components/pages/nodescan/modals/NetworkModal'
import SystemModal from '../../components/pages/nodescan/modals/SystemModal'
import TimeModal from '../../components/pages/nodescan/modals/TimeModal'
import NodeScanTableRow from '../../components/pages/nodescan/NodeScanTableRow'
import NodeScanTableToolbar from '../../components/pages/nodescan/NodeScanTableToolbar'
import useAlert from '../../hooks/useAlert'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import useTable from '../../hooks/useTable'
import { THandleInputChange } from '../../types/components/common'
import { ITableAction, ITableHead } from '../../types/components/table'
import {
  ICommandResponse,
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../types/pages/common'
import { INetworkResult } from '../../types/pages/network'
import {
  IMaintenanceValue,
  IModalData,
  INodeScanFormData,
  INodeScanLicenseResult,
  INodeScanResult,
  INodeScanSystemResult,
} from '../../types/pages/nodeScan'
import { ITimeResult } from '../../types/pages/time'
import {
  defaultIcon,
  licenseIcon,
  networkIcon,
  rebootIcon,
  scanIcon,
  systemIcon,
  timeIcon,
  updateIcon,
} from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'
import { IActionsButton } from '../../types/components/actionButtons'

const TABLE_HEAD: ITableHead[] = [
  { id: 'Mac', label: t`MAC`, filter: false },
  { id: 'NodeType', label: t`Node Type`, filter: false },
  { id: 'Elevator', label: t`Elevator`, filter: false },
  { id: 'Product', label: t`Product`, filter: false },
  { id: 'Model', label: t`Model`, filter: false },
  { id: 'Type', label: t`Type`, filter: false },
  { id: 'Licensed', label: t`Licensed`, filter: false },
  { id: 'Address', label: t`Address`, filter: false },
  { id: 'Timezone', label: t`Timezone`, filter: false },
  { id: 'Version', label: t`Version`, filter: false },
]

function NodeScan() {
  const location = useLocation()

  const {
    rowsPerPage,
    order,
    orderBy,
    selected,
    handleSort,
    handleOrder,
    handleSelectRow,
    handleSelectAllRow,
  } = useTable({ defaultOrderBy: TABLE_HEAD[0].id })

  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<INodeScanFormData>({
    UserId: '',
    Password: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<INodeScanFormData>>(
    {},
    scrollToErrorElement
  )
  // Define the state for manage modal open/close and Data  state
  const [openNetworkModal, setOpenNetworkModal] = useState<boolean>(false)
  const [openLicenseModal, setOpenLicenseModal] = useState<boolean>(false)
  const [openSystemModal, setOpenSystemModal] = useState<boolean>(false)
  const [openTimeModal, setOpenTimeModal] = useState<boolean>(false)
  const [maintenanceModal, setMaintenanceModal] = useState<IMaintenanceValue | null>(null)

  const [modalData, setModalData] = useState<IModalData>({
    Network: null,
    License: null,
    System: null,
    Time: null,
  })

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  const { isLoading, data, mutate } = useSWR<ICommandResponse<INodeScanResult[]>>(
    nodeScanApi.list,
    {
      refreshInterval: 0,
    }
  )

  // Check is UserId and Password
  const hasErrorOnFormData = (): boolean => {
    // Validate the form data
    const errors: INewFormErrors<INodeScanFormData> = {}
    if (!formData.UserId) {
      errors.UserId = t`User ID is required`
    }
    if (!formData.Password) {
      errors.Password = t`Password is required`
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      //Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value)
      //   }
      // })
      return true
    }
    return false
  }

  // mutation for get network data
  const { trigger: getNetworkTrigger, isMutating: getNetworkAllLoading } = useSWRMutation(
    nodeScanApi.getNetwork,
    sendPostRequest,
    {
      onSuccess: (networkData: ICommandResponse<INetworkResult[]>) => {
        setModalData((prev) => ({ ...prev, Network: networkData.cgi.data[0] }))
      },
    }
  )
  const handleGetNetwork = () => {
    if (hasErrorOnFormData()) {
      return
    }
    setOpenNetworkModal(true)
    getNetworkTrigger({
      UserId: formData.UserId,
      Password: formData.Password,
      Mac: selected[0],
    })
  }

  // mutation for get license data
  const { trigger: getLicenseTrigger, isMutating: getLicenseAllLoading } = useSWRMutation(
    nodeScanApi.getLicense,
    sendPostRequest,
    {
      onSuccess: (licenseData: ICommandResponse<INodeScanLicenseResult[]>) => {
        setModalData((prev) => ({ ...prev, License: licenseData.cgi.data[0] }))
      },
    }
  )
  const handleGetLicense = () => {
    if (hasErrorOnFormData()) {
      return
    }
    setOpenLicenseModal(true)
    getLicenseTrigger({
      UserId: formData.UserId,
      Password: formData.Password,
      Mac: selected[0],
    })
  }

  // mutation for get system data
  const { trigger: getSystemTrigger, isMutating: getSystemAllLoading } = useSWRMutation(
    nodeScanApi.getSystem,
    sendPostRequest,
    {
      onSuccess: (systemData: ICommandResponse<INodeScanSystemResult[]>) => {
        setModalData((prev) => ({ ...prev, System: systemData.cgi.data[0] }))
      },
    }
  )
  const handleGetSystem = () => {
    if (hasErrorOnFormData()) {
      return
    }
    setOpenSystemModal(true)
    getSystemTrigger({
      UserId: formData.UserId,
      Password: formData.Password,
      Mac: selected[0],
    })
  }

  // mutation for get time data
  const { trigger: getTimeTrigger, isMutating: getTimeAllLoading } = useSWRMutation(
    nodeScanApi.getTime,
    sendPostRequest,
    {
      onSuccess: (timeData: ICommandResponse<ITimeResult[]>) => {
        setModalData((prev) => ({ ...prev, Time: timeData.cgi.data[0] }))
      },
      onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
        serverErrorHandler(error, setFormErrors)
      },
    }
  )
  const handleGetTime = () => {
    if (hasErrorOnFormData()) {
      return
    }
    setOpenTimeModal(true)
    getTimeTrigger({
      UserId: formData.UserId,
      Password: formData.Password,
      Mac: selected[0],
    })
  }

  const handleMaintenance = (type: IMaintenanceValue) => {
    if (hasErrorOnFormData()) {
      return
    }
    setMaintenanceModal(type)
  }

  const handleScan = () => {
    mutate()
  }

  const tableActions: IActionsButton[] = [
    {
      text: t`Scan`,
      icon: scanIcon,
      onClick: handleScan,
    },
    {
      text: t`Network`,
      icon: networkIcon,
      // tooltip: 'Network',
      onClick: handleGetNetwork,
      disabled: selected.length === 0,
    },
    {
      text: t`License`,
      icon: licenseIcon,
      // tooltip: 'License',
      onClick: handleGetLicense,
      disabled: selected.length === 0,
    },
    {
      text: t`System`,
      icon: systemIcon,
      onClick: handleGetSystem,
      disabled: selected.length === 0,
    },
    {
      text: t`Time`,
      icon: timeIcon,
      // tooltip: 'Time',
      onClick: handleGetTime,
      disabled: selected.length === 0,
    },
    {
      text: t`Update`,
      icon: updateIcon,
      // tooltip: 'Update',
      onClick: () => handleMaintenance('update'),
      disabled: selected.length === 0,
    },
    {
      text: t`Default`,
      icon: defaultIcon,
      // tooltip: 'Default',
      onClick: () => handleMaintenance('default'),
      disabled: selected.length === 0,
    },
    {
      text: t`Reboot`,
      icon: rebootIcon,
      // tooltip: 'Reboot',
      onClick: () => handleMaintenance('reboot'),
      disabled: selected.length === 0,
    },
  ]

  const isNotFound = !data?.cgi?.data?.length && !isLoading

  return (
    <Page>
      <Breadcrumbs />
      <TableContainer>
        <NodeScanTableToolbar
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          // refetchListData={() => mutate()}
        />
        <TableAction breadcrumbsActions={tableActions} numSelected={selected.length} />
        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            numSelected={selected.length}
            rowCount={data?.cgi?.data?.length}
            handleSort={handleSort}
            handleOrder={handleOrder}
            selectAllRow={(isAllSelected: boolean) => {
              if (data?.cgi?.data) {
                handleSelectAllRow(
                  isAllSelected,
                  data?.cgi?.data?.map((result) => result.Mac.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.cgi?.data?.map((row) => (
                  <NodeScanTableRow
                    key={row.Mac}
                    row={row}
                    selected={selected}
                    handleSelectRow={handleSelectRow}
                  />
                ))}
              </>
            )}
          </tbody>
        </Table>
        <TableBodyLoading isLoading={isLoading} tableRowPerPage={rowsPerPage} />
        <TableNoData isNotFound={isNotFound} />
      </TableContainer>
      {/* set network modal */}
      <Modal openModal={openNetworkModal} setOpenModal={setOpenNetworkModal}>
        <NetworkModal
          Macs={selected}
          networkData={modalData.Network}
          isLoading={getNetworkAllLoading}
          setOpenModal={setOpenNetworkModal}
        />
      </Modal>
      {/* set license modal */}
      <Modal openModal={openLicenseModal} setOpenModal={setOpenLicenseModal}>
        <LicenseModal
          Macs={selected}
          loginInfo={formData}
          licenseData={modalData.License}
          isLoading={getLicenseAllLoading}
          setOpenModal={setOpenLicenseModal}
        />
      </Modal>
      {/* set system modal */}
      <Modal openModal={openSystemModal} setOpenModal={setOpenSystemModal}>
        <SystemModal
          Macs={selected}
          loginInfo={formData}
          systemData={modalData.System}
          isLoading={getSystemAllLoading}
          setOpenModal={setOpenSystemModal}
        />
      </Modal>
      {/* set time modal */}
      <Modal openModal={openTimeModal} setOpenModal={setOpenTimeModal}>
        <TimeModal
          Macs={selected}
          loginInfo={formData}
          timeData={modalData.Time}
          isLoading={getTimeAllLoading}
          setOpenModal={setOpenTimeModal}
        />
      </Modal>
      {/* set maintenance modal */}
      <Modal openModal={!!maintenanceModal} setOpenModal={() => setMaintenanceModal(null)}>
        <MaintenanceModal
          modalType={maintenanceModal}
          Macs={selected}
          loginInfo={formData}
          setOpenModal={() => setMaintenanceModal(null)}
        />
      </Modal>
    </Page>
  )
}

export default NodeScan
