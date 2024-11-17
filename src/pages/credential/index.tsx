import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest, sendPostRequest } from '../../api/swrConfig'
import { credentialApi } from '../../api/urls'
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
import CredentialTableRow from '../../components/pages/credential/CredentialTableRow'
import CredentialTableToolbar from '../../components/pages/credential/CredentialTableToolbar'
import useAlert from '../../hooks/useAlert'
import useAuth from '../../hooks/useAuth'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  ICredentialApiQueryParams,
  ICredentialFilters,
  ICredentialResult,
} from '../../types/pages/credential'
import executeCallbackIfRowSelected from '../../utils/executeCallbackIfRowSelected'
import {
  addIcon,
  bulkLoadIcon,
  deleteIcon,
  filterIcon,
  groupEditIcon,
  sendInvitationEmailIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'CredentialNo', label: t`Credential No`, filter: true },
  { id: 'FormatNo', label: t`Format`, filter: true },
  { id: 'CredentialNumb', label: t`Credential Number`, filter: true },
  { id: 'CredentialType', label: t`Credential Type`, filter: true },
  { id: 'CredentialStat', label: t`Credential Stat`, filter: true },
  { id: 'FirstName', label: t`First Name`, filter: true },
  { id: 'LastName', label: t`Last Name`, filter: true },
  { id: 'Email', label: t`Email`, filter: true },
]

function Credential() {
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

  const { license } = useAuth()
  const isSixOptionPresent = license?.Options[5] === '1'

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: ICredentialFilters = {
    Apply: false,
    CredentialNo: '',
    Format: null,
    CredentialNumb: '',
    CredentialType: null,
    CredentialStat: null,
    LastName: '',
    FirstName: '',
    Email: '',
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
    // apply will be false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is applied or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    updateRouteQueryWithReplace({
      pathName: location.pathname,
      query: {
        page: 1,
        CredentialNo_icontains: filterStateRef.current.CredentialNo,
        FormatValue: filterStateRef.current.Format?.value,
        FormatLabel: filterStateRef.current.Format?.label,
        CredentialNumb: filterStateRef.current.CredentialNumb,
        CredentialTypeValue: filterStateRef.current.CredentialType?.value,
        CredentialTypeLabel: filterStateRef.current.CredentialType?.label,
        CredentialStatValue: filterStateRef.current.CredentialStat?.value,
        CredentialStatLabel: filterStateRef.current.CredentialStat?.label,
        LastName: filterStateRef.current.LastName,
        FirstName: filterStateRef.current.FirstName,
        Email: filterStateRef.current.Email,
      },
    })
  }

  // handle the apply button for the filters
  const handleFilterApply = () => {
    // on filter apply, filterStateRef updates to the current filter state
    filterStateRef.current = filterState
    updateFilterStateToQuery()
    handleFilterInputChange('Apply', true)
  }

  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter reset, filterStateRef updates to the initial filter state
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
    mutate(undefined, true)
  }

  // in route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: ICredentialFilters = {
      Apply: true,
      CredentialNo:
        typeof queryParse.CredentialNo_icontains === 'string'
          ? queryParse.CredentialNo_icontains
          : '',
      Format:
        typeof queryParse.FormatLabel === 'string' && typeof queryParse.FormatValue === 'string'
          ? {
              label: queryParse.FormatLabel,
              value: queryParse.FormatValue,
            }
          : null,
      CredentialNumb:
        typeof queryParse.CredentialNumb === 'string' ? queryParse.CredentialNumb : '',
      CredentialType:
        typeof queryParse.CredentialTypeLabel === 'string' &&
        typeof queryParse.CredentialTypeValue === 'string'
          ? {
              label: queryParse.CredentialTypeLabel,
              value: queryParse.CredentialTypeValue,
            }
          : null,
      CredentialStat:
        typeof queryParse.CredentialStatLabel === 'string' &&
        typeof queryParse.CredentialStatValue === 'string'
          ? {
              label: queryParse.CredentialStatLabel,
              value: queryParse.CredentialStatValue,
            }
          : null,
      LastName: typeof queryParse.LastName === 'string' ? queryParse.LastName : '',
      FirstName: typeof queryParse.FirstName === 'string' ? queryParse.FirstName : '',
      Email: typeof queryParse.Email === 'string' ? queryParse.Email : '',
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // create the query object for the API call
  const apiQueryParams: ICredentialApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.CredentialNo && {
      CredentialNo: filterStateRef.current.CredentialNo,
    }),
    ...(filterStateRef.current.Format &&
      filterStateRef.current.Format.value && {
        FormatNo: filterStateRef.current.Format.value,
      }),
    ...(filterStateRef.current.CredentialNumb && {
      CredentialNumb: filterStateRef.current.CredentialNumb,
    }),
    ...(filterStateRef.current.CredentialType &&
      filterStateRef.current.CredentialType.value && {
        CredentialType: filterStateRef.current.CredentialType.value,
      }),
    ...(filterStateRef.current.CredentialStat &&
      filterStateRef.current.CredentialStat.value && {
        CredentialStat: filterStateRef.current.CredentialStat.value,
      }),
    ...(filterStateRef.current.LastName && {
      LastName_icontains: filterStateRef.current.LastName,
    }),
    ...(filterStateRef.current.FirstName && {
      FirstName_icontains: filterStateRef.current.FirstName,
    }),
    ...(filterStateRef.current.Email && {
      Email_icontains: filterStateRef.current.Email,
    }),
    // query for fetch table data after delete row
    ...(isDeletedIds.length && {
      isDeletedIds: JSON.stringify(isDeletedIds),
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<ICredentialResult[]>>(
    credentialApi.list(apiQueryString)
  )

  //Invitation Email
  const { trigger: sendInvitationTrigger } = useSWRMutation(
    credentialApi.invitation,
    sendPostRequest
    // {
    //   onSuccess: () => {
    //     addSuccessfulToast(t`Send Invitation Success`);
    //   },
    // }
  )

  const handleSendInvitation = () => {
    openAlertDialogWithPromise(
      () =>
        sendInvitationTrigger({
          CredentialIds: selected,
        }),
      {
        success: t`Success`,
      },
      t(`Do you want to Send Invitation Email ?`)
    )
  }
  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    credentialApi.deleteMultiple,
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

  const handleDeleteMultiple = () => {
    const requestData = { ids: selected }
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

  // // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   credentialApi.export,
  //   fetcher,
  //   {
  //     onSuccess: (csvData) => {
  //       downloadCsv(csvData, location)
  //     },
  //   }
  // )
  //
  // // Define the mutation function to send CSV file to the server
  // const { trigger: importCSVTrigger, isMutating: importCSVLoading } = useSWRMutation(
  //   credentialApi.import,
  //   sendPostRequestWithFile,
  //   {
  //     onSuccess: () => {
  //       addSuccessfulToast()
  //     },
  //   }
  // )

  const breadcrumbsActions: IActionsButton[] = [
    // {
    //   color: 'danger',
    //   icon: exportIcon,
    //   text: t`Export`,
    //   onClick: () => {
    //     csvDataTrigger()
    //   },
    //   isLoading: csvDataLoading,
    // },
    // {
    //   color: 'danger',
    //   icon: importIcon,
    //   text: t`Import`,
    //   iconClass: 'rotate-90',
    //   type: 'file',
    //   accept:
    //     '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"',
    //   handleFile: (file: File) => {
    //     importCSVTrigger({ file })
    //   },
    //   isLoading: importCSVLoading,
    // },
    {
      // color: 'danger',
      icon: bulkLoadIcon,
      text: t`Bulk Load`,
      link: routeProperty.credentialBulkLoad.path(),
    },
    // {
    //   icon: addIcon,
    //   text: t`Add`,
    //   link: routeProperty.credentialCreate.path(),
    // },
  ]

  const commonTableActions: IActionsButton[] = [
    {
      icon: filterIcon,
      text: t`Filter`,
      onClick: () => setFilterOpen((prevSate) => !prevSate),
    },
    {
      icon: addIcon,
      text: t`Add`,
      link: routeProperty.credentialCreate.path(),
    },
    {
      icon: deleteIcon,
      text: t`Delete`,
      // tooltip: 'Delete',
      onClick: handleDeleteMultiple,
      disabled: selected.length === 0,
    },
    {
      icon: groupEditIcon,
      text: t`Group edit`,
      // tooltip: 'Group edit',
      link: routeProperty.credentialGroupEdit.path(selected.join(',')),
      disabled: selected.length === 0,
    },
  ]

  const tableActions: IActionsButton[] = isSixOptionPresent
    ? [
        ...commonTableActions,
        {
          color: 'danger',
          icon: sendInvitationEmailIcon,
          text: t`Send Invitation Email`,
          onClick: () =>
            executeCallbackIfRowSelected(
              !selected.length,
              handleSendInvitation,
              'Select a credential'
            ),
          size: 'base',
          disabled: selected.length === 0,
        },
      ]
    : commonTableActions

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <TableContainer>
        {filterOpen && (
          <CredentialTableToolbar
            filterState={filterState}
            handleFilterStateReset={handleFilterStateReset}
            handleFilterApply={handleFilterApply}
            handleInputChange={handleFilterInputChange}
          />
        )}
        <TableAction breadcrumbsActions={tableActions} numSelected={selected.length} />
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
                  data?.data.map((result) => result.CredentialNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <CredentialTableRow
                    key={row.CredentialNo}
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

export default Credential
