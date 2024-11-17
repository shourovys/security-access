import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import QueryString from 'qs'
import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../api/swrConfig'
import { userApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import Table from '../../components/HOC/style/table/Table'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import Pagination from '../../components/common/table/Pagination'
import TableAction from '../../components/common/table/TableAction'
import TableEmptyRows from '../../components/common/table/TableEmptyRows'
import TableHeader from '../../components/common/table/TableHeader'
import TableNoData from '../../components/common/table/TableNoData'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TableBodyLoading from '../../components/loading/table/TableBodyLoading'
import UserTableRow from '../../components/pages/user/UserTableRow'
import UserTableToolbar from '../../components/pages/user/UserTableToolbar'
import useAlert from '../../hooks/useAlert'
import useAuth from '../../hooks/useAuth'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import { IUserFilters, IUserResult } from '../../types/pages/user'
import { filterIcon } from '../../utils/icons'
import t from '../../utils/translator'

function User() {
  const location = useLocation()
  const { showPartition } = useAuth()

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
  } = useTable({ defaultOrderBy: 'UserNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'UserNo', label: t`User No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'UserId', label: t`User ID`, filter: true },
    { id: 'UserDesc', label: t`Description`, filter: true },
    { id: 'RoleNo', label: t`User Role`, filter: true },
  ]

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IUserFilters = {
    Apply: false,
    UserNo: '',
    UserId: '',
    Partition: null,
    Role: null,
  }

  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)
  // state to store deleted rows ids
  const [isDeletedIds, setIsDeletedIds] = useState<string[]>([])

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    updateRouteQueryWithReplace({
      pathName: location.pathname,
      query: {
        page: 1,
        UserNo: filterStateRef.current.UserNo,
        UserID: filterStateRef.current.UserId,
        PartitionValue: filterStateRef.current.Partition?.value,
        PartitionLabel: filterStateRef.current.Partition?.label,
        RoleValue: filterStateRef.current.Role?.value,
        RoleLabel: filterStateRef.current.Role?.label,
      },
    })
  }
  // handle the apply button for the filters
  const handleFilterApply = () => {
    // on filter apply filterStateRef update to filter current state
    filterStateRef.current = filterState
    updateFilterStateToQuery()
    handleFilterInputChange('apply', true)
  }
  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter apply filterStateRef update to initial filter state
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
    mutate(undefined, true)
  }

  // create the query object for the API call
  const apiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.UserNo && {
      UserNo: filterStateRef.current.UserNo,
    }),
    ...(filterStateRef.current.UserId && {
      UserId: filterStateRef.current.UserId,
    }),
    ...(filterStateRef.current.Partition?.value && {
      Partition: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.Role?.value && {
      Role: filterStateRef.current.Role.value,
    }),
    // query for fetch table data after delete row
    ...(isDeletedIds.length && {
      isDeletedIds: JSON.stringify(isDeletedIds),
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IUserResult[]>>(
    userApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    userApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // Show a success message and redirect to partition list page on successful delete
      onSuccess: () => {
        handleSelectAllRow(false, [])
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeletedIds([])
      },
    }
  )

  const handleDeleteMultiple = async () => {
    const requestData = { ids: selected.filter((id) => id !== '0') }
    // const requestConfig: AxiosRequestConfig = {
    //     data: requestData,
    // };
    if (requestData.ids.length) {
      const handleDelete = () => {
        return multipleDeleteTrigger({
          data: requestData,
        }).then(() => {
          // update detected rows id for refetch table data
          setIsDeletedIds(selected)
        })
      }

      openAlertDialogWithPromise(handleDelete, { success: t`Success` }, t`Do you want to Delete ?`)
    }
  }
  //remove csv functionality and icon --rubel
  // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   userApi.export,
  //   fetcher,
  //   {
  //     onSuccess: (csvData) => {
  //       downloadCsv(csvData, location)
  //     },
  //   }
  // )
  //Change add position and add delete icon(modify breadcrumbsActions position also and added delete disablity).--rubel
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: filterIcon,
      text: t`Filter`,
      onClick: () => setFilterOpen((prevSate) => !prevSate),
    },
    {
      icon: faAdd,
      text: t`Add`,
      link: '/user/add',
    },
    {
      icon: faTrashCan,
      text: t`Delete`,
      onClick: handleDeleteMultiple,
      disabled: selected.length === 0,
    },
  ]

  // const tableActions: ITableAction[] = [
  //   {
  //     icon: faTrashCan,
  //     tooltip: 'Delete',
  //     onClick: handleDeleteMultiple,
  //   },
  // ]

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page title={t`User List`}>
      <Breadcrumbs />
      <TableContainer>
        {filterOpen && (
          <UserTableToolbar
            filterState={filterState}
            handleFilterStateReset={handleFilterStateReset}
            handleFilterApply={handleFilterApply}
            handleInputChange={handleFilterInputChange}
          />
        )}
        <TableAction breadcrumbsActions={breadcrumbsActions} numSelected={selected.length} />
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
                  data?.data.map((result) => result.UserNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <UserTableRow
                    key={row.UserNo}
                    row={row}
                    selected={selected}
                    handleSelectRow={handleSelectRow}
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
    </Page>
  )
}

export default User
