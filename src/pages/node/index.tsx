import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest, sendPostRequest } from '../../api/swrConfig'
import { nodeApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import Modal from '../../components/HOC/modal/Modal'
import Table from '../../components/HOC/style/table/Table'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import Pagination from '../../components/common/table/Pagination'
import TableAction from '../../components/common/table/TableAction'
import TableEmptyRows from '../../components/common/table/TableEmptyRows'
import TableHeader from '../../components/common/table/TableHeader'
import TableNoData from '../../components/common/table/TableNoData'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TableBodyLoading from '../../components/loading/table/TableBodyLoading'
import NodeTableRow from '../../components/pages/node/NodeTableRow'
import NodeTableToolbar from '../../components/pages/node/NodeTableToolbar'
import SetTimeModal from '../../components/pages/node/setTime/SetTimeModal'
import SwSyncModal from '../../components/pages/node/swSync/SwSyncModal'
import useAlert from '../../hooks/useAlert'
import useAuth from '../../hooks/useAuth'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import { IActionButtonsGroup } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  INodeApiQueryParams,
  INodeFilters,
  INodeResult,
  INodeRouteQueryParams,
} from '../../types/pages/node'
import {
  addIcon,
  dbSyncIcon,
  deleteIcon,
  filterIcon,
  rebootIcon,
  reloadIcon,
  setTimerIcon,
  swSyncIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'NodeNo', label: t`Node No`, filter: true },
  { id: 'NodeName', label: t`Node Name`, filter: true },
  { id: 'NodeDesc', label: t`Description`, filter: true },
  { id: 'NodeType', label: t`Node Type`, filter: true },
  { id: 'Elevator', label: t`Elevator`, filter: true },
  { id: 'Mac', label: t`MAC`, filter: true },
  { id: 'Product', label: t`Product`, filter: true },
  { id: 'Version', label: t`Version`, filter: true },
  { id: 'Address', label: t`Address`, filter: true },
  { id: 'Timezone', label: t`Timezone`, filter: true },
  { id: 'Online', label: t`Online`, filter: true },
]

function Node() {
  const location = useLocation()

  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    selected,
    handleChangePage,
    handleSort,
    handleOrder,
    handleChangeRowsPerPage,
    handleSelectRow,
    handleSelectAllRow,
  } = useTable({ defaultOrderBy: TABLE_HEAD[0].id })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  //to initialize layout
  const { layout } = useAuth()

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: INodeFilters = {
    Apply: false,
    NodeNo: '',
    NodeName: '',
    Mac: '',
    Address: '',
  }
  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)
  // Define the state for manage set time and SW load modal state
  const [openTimeModal, setOpenTimeModal] = useState<boolean>(false)
  const [swLoadModal, setSwLoadModal] = useState<boolean>(false)

  // Define a state to hold the selected nodes
  const [selectedNodes, setSelectedNodes] = useState<INodeResult[]>([])
  const [isMasterSelected, setIsMasterSelected] = useState<boolean>(false)

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: INodeRouteQueryParams = {
      page: 1,
      NodeNo: filterStateRef.current.NodeNo,
      NodeName: filterStateRef.current.NodeName,
      Mac: filterStateRef.current.Mac,
      Address: filterStateRef.current.Address,
    }
    updateRouteQueryWithReplace({
      pathName: location.pathname,
      query: queryParams,
    })
  }
  // handle the apply button for the filters
  const handleFilterApply = () => {
    // on filter apply filterStateRef update to filter current state
    filterStateRef.current = filterState
    updateFilterStateToQuery()
    handleFilterInputChange('Apply', true)
  }
  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter apply filterStateRef update to initial filter state
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
    mutate(undefined, true)
  }

  // Function to handle row select
  const handleSelectFullRow = (node: INodeResult) => {
    const selectedIndex = selectedNodes.findIndex(
      (selectedNode) => selectedNode.NodeNo === node.NodeNo
    )

    let newSelectedNodes: INodeResult[] = []

    if (selectedIndex === -1) {
      newSelectedNodes = [...selectedNodes, node]
    } else if (selectedIndex === 0) {
      newSelectedNodes = selectedNodes.slice(1)
    } else if (selectedIndex === selectedNodes.length - 1) {
      newSelectedNodes = selectedNodes.slice(0, -1)
    } else if (selectedIndex > 0) {
      newSelectedNodes = [
        ...selectedNodes.slice(0, selectedIndex),
        ...selectedNodes.slice(selectedIndex + 1),
      ]
    }

    setIsMasterSelected(newSelectedNodes.some((node) => node.NodeType === 1))
    handleSelectRow(node.NodeNo.toString())
    setSelectedNodes(newSelectedNodes)
  }

  // in route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: INodeFilters = {
      NodeNo: typeof queryParse.NodeNo === 'string' ? queryParse.NodeNo : '',
      NodeName: typeof queryParse.NodeName === 'string' ? queryParse.NodeName : '',
      Mac: typeof queryParse.Mac === 'string' ? queryParse.Mac : '',
      Address: typeof queryParse.Address === 'string' ? queryParse.Address : '',
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // query object of pagination, sorting, filtering
  const apiQueryParams: INodeApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.NodeNo && { NodeNo: filterStateRef.current.NodeNo }),
    ...(filterStateRef.current.NodeName && {
      NodeName_icontains: filterStateRef.current.NodeName,
    }),
    ...(filterStateRef.current.Mac && { Mac_icontains: filterStateRef.current.Mac }),
    ...(filterStateRef.current.Address && { Address_icontains: filterStateRef.current.Address }),
    // ...(isDeletedIds.length && { isDeletedIds: JSON.stringify(isDeletedIds) }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<INodeResult[]>>(
    nodeApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    nodeApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      onSuccess: () => {
        handleSelectAllRow(false, [])
        mutate()
      },
      onError: () => {
        // setIsDeletedIds([])
      },
    }
  )

  // const handleDeleteMultiple = () => {
  //   const requestData = { ids: selected }
  //   // const requestConfig: AxiosRequestConfig = {
  //   //     data: requestData,
  //   // };

  //   if (requestData.ids.length) {
  //     const handleDelete = () => {
  //       return multipleDeleteTrigger({
  //         data: requestData,
  //       }).then(() => {
  //         // update detected rows id for refetch table data
  //         // setIsDeletedIds(selected)
  //       })
  //     }

  //     // openAlertDialogWithPromise(handleDelete, { success: t`Successful` })
  //     openAlertDialogWithPromise(
  //       handleDelete,
  //       { success: t`Successful` },
  //       'Do you really want to delete ?'
  //     )
  //   }
  // }

  const token = sessionStorage.getItem('accessToken')

  const handleDeleteMultiple = async () => {
    // console.log(document.title)

    const requestData = { ids: selected }
    // const requestConfig: AxiosRequestConfig = {
    //     data: requestData,
    // };

    if (requestData.ids.length) {
      // console.log(requestData.ids)
      // console.log(selected)

      const jsonString = JSON.stringify(selected)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/devices/nodeInfoView/?node_ids=${encodeURIComponent(
          jsonString
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()

      // console.log(`new data =>`, data)

      const messages = []

      for (const key in data) {
        if (data[key] !== undefined && data[key] !== 0) {
          messages.push(`${data[key]}`)
        }
      }

      const tableRows = messages.map((message, index) => (
        <tr key={index}>
          <td>{message}</td>
        </tr>
      ))

      // Construct the entire message with a table
      const myMessage =
        messages.length > 0 ? (
          <div>
            <p>If you Delete this, the followings also:</p>
            <table>
              <tbody>{tableRows}</tbody>
            </table>
            <p>Do you want to Delete?</p>
          </div>
        ) : null

      const handleDelete = async () => {
        return multipleDeleteTrigger({
          data: requestData,
        })
      }

      if (messages.includes('')) {
        openAlertDialogWithPromise(
          handleDelete,
          { success: t`Success` },
          t(`Do you want to Delete ?`)
        )
      } else {
        openAlertDialogWithPromise(handleDelete, { success: t`Success` }, myMessage as any)
      }
    }
  }

  //  Define the mutation function to DB sync all selected

  const { trigger: DBSyncTrigger } = useSWRMutation(nodeApi.dbSync, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const handleDBSync = () => {
    if (selected.length) {
      const handleDBSyncTrigger = () =>
        DBSyncTrigger({
          NodeNos: selected,
        })

      openAlertDialogWithPromise(
        handleDBSyncTrigger,
        { success: t`Success` },
        t('Do you want to DB Sync?')
      )
    }
  }

  // Define the mutation function to reboot all selected nodes
  const { trigger: rebootTrigger } = useSWRMutation(nodeApi.reboot, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const { trigger: reloadTrigger } = useSWRMutation(nodeApi.reload, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const handleReboot = () => {
    if (selected.length) {
      const handleRebootTrigger = () =>
        rebootTrigger({
          NodeNos: selected,
        })

      openAlertDialogWithPromise(
        handleRebootTrigger,
        { success: t`Success` },
        t('Do you want to Reboot?')
      )
    }
  }

  const handleReload = () => {
    if (selected.length) {
      const handleReloadTrigger = () =>
        reloadTrigger({
          NodeNos: selected,
        })

      openAlertDialogWithPromise(
        handleReloadTrigger,
        { success: t`Success` },
        t(`Do you want to Reload?`)
      )
    }
  }

  // // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   nodeApi.export,
  //   fetcher,
  //   {
  //     onSuccess: (csvData) => {
  //       downloadCsv(csvData, location)
  //     },
  //   }
  // )

  // const breadcrumbsActions: IActionsButton[] = [
  //   // {
  //   //   color: 'csv',
  //   //   icon: csvIcon,
  //   //   text: t`CSV`,
  //   //   onClick: () => {
  //   //     csvDataTrigger()
  //   //   },
  //   //   isLoading: csvDataLoading,
  //   // },
  //   // {
  //   //   icon: addIcon,
  //   //   text: t`Add`,
  //   //   link: '/node/add',
  //   // },
  // ]

  const tableActions: IActionButtonsGroup = {
    Modify: [
      {
        icon: filterIcon,
        text: t`Filter`,
        onClick: () => setFilterOpen((prevSate) => !prevSate),
      },
      {
        icon: addIcon,
        text: t`Add`,
        link: '/node/add',
      },
      {
        text: t`Delete`,
        icon: deleteIcon,
        // tooltip: 'Delete',
        onClick: handleDeleteMultiple,
        disabled: selected.length === 0,
      },
    ],
    DB: [
      {
        text: t`Set Time`,
        icon: setTimerIcon,
        // tooltip: 'Set Time',
        onClick: () => setOpenTimeModal(true),
        disabled: isMasterSelected || selected.length === 0,
      },
      {
        text: t`SW Sync`,
        icon: swSyncIcon,
        // tooltip: 'SW Sync',
        iconClass: 'rotate-90',
        onClick: () => setSwLoadModal(true),
        disabled: isMasterSelected || selected.length === 0,
      },
      {
        text: t`DB Sync`,
        icon: dbSyncIcon,
        // tooltip: 'DB Sync',
        onClick: handleDBSync,
        disabled: isMasterSelected || selected.length === 0,
      },
      {
        text: t`Reboot`,
        icon: rebootIcon,
        // tooltip: 'Reboot',
        onClick: handleReboot,
        disabled: isMasterSelected || selected.length === 0,
      },
      {
        text: t`Reload`,
        icon: reloadIcon,
        // tooltip: 'Reload',
        onClick: handleReload,
        disabled: selected.length === 0,
      },
    ],
  }

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs />
      <TableContainer>
        {filterOpen && (
          <NodeTableToolbar
            filterState={filterState}
            handleFilterStateReset={handleFilterStateReset}
            handleFilterApply={handleFilterApply}
            handleInputChange={handleFilterInputChange}
          />
        )}
        <TableAction groupActions={tableActions} numSelected={selected.length} />
        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            numSelected={selected.length}
            rowCount={data?.data.length}
            handleSort={handleSort}
            handleOrder={handleOrder}
            selectAllRow={(isAllSelected: boolean) => {
              if (data?.data) {
                handleSelectAllRow(
                  isAllSelected,
                  data?.data.map((result) => result.NodeNo.toString())
                )
                if (isAllSelected) {
                  setIsMasterSelected(data?.data.some((node) => node.NodeType === 1))
                }
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <NodeTableRow
                    key={row.NodeNo}
                    row={row}
                    selected={selected}
                    handleSelectRow={handleSelectFullRow}
                  />
                ))}
                <TableEmptyRows
                  emptyRows={data?.data ? emptyRows(page, rowsPerPage, data?.count) : 0}
                />
              </>
            )}
          </tbody>
        </Table>
        <TableBodyLoading isLoading={isLoading} tableRowPerPage={rowsPerPage} />
        <TableNoData isNotFound={isNotFound} />
        <Pagination
          totalRows={data?.count || 0}
          currentPage={page}
          rowsPerPage={rowsPerPage}
          currentPath={location.pathname}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {/* set time modal */}
      <Modal openModal={openTimeModal} setOpenModal={setOpenTimeModal}>
        <SetTimeModal NodeNo={selected} setOpenModal={setOpenTimeModal} />
      </Modal>
      {/* sw Load modal */}
      <Modal openModal={swLoadModal} setOpenModal={setSwLoadModal}>
        <SwSyncModal NodeNo={selected} setOpenModal={setSwLoadModal} />
      </Modal>
    </Page>
  )
}

export default Node
