import { personApi } from '../../../../../api/urls'
import Table from '../../../../../components/HOC/style/table/Table'
import TableContainer from '../../../../../components/HOC/style/table/TableContainer'
import Pagination from '../../../../../components/common/table/Pagination'
import TableEmptyRows from '../../../../../components/common/table/TableEmptyRows'
import TableHeader from '../../../../../components/common/table/TableHeader'
import TableNoData from '../../../../../components/common/table/TableNoData'
import TableBodyLoading from '../../../../../components/loading/table/TableBodyLoading'
import useTable, { emptyRows } from '../../../../../hooks/useTable'
import QueryString from 'qs'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../../../types/components/common'
import { ITableHead } from '../../../../../types/components/table'
import { IListServerResponse } from '../../../../../types/pages/common'
import {
  IPersonApiQueryParams,
  IPersonFilters,
  IPersonResult,
} from '../../../../../types/pages/person'
import PersonListModalRow from './PersonListModalRow'
import PersonListModalToolbar from './PersonListModalToolbar'
import t from '../../../../../utils/translator'

interface IProps {
  selectedPersonId: string
  handleSelectedPerson: (_person: IPersonResult) => void
}

function PersonListModal({ selectedPersonId, handleSelectedPerson }: IProps) {
  const location = useLocation()

  const { page, rowsPerPage, order, orderBy, selected, handleChangePage, handleSort, handleOrder } =
    useTable({ defaultOrderBy: 'PersonNo' })

  const TABLE_HEAD = useMemo<ITableHead[]>(
    () => [
      { id: 'PersonNo', label: t`Person No`, filter: true },
      // { id: 'PartitionNo', label: t`Partition`, filter: true },
      { id: 'FirstName', label: t`First Name`, filter: true },
      { id: 'MiddleName', label: t`Middle Name`, filter: true },
      { id: 'LastName', label: t`Last Name`, filter: true },
      // { id: 'Email', label: t`Email`, filter: true },
      { id: 'radio', label: '', filter: false },
    ],
    []
  )

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IPersonFilters = {
    Apply: false,
    PersonNo: '',
    LastName: '',
    FirstName: '',
    Email: '',
    PartitionNo: null,
    Field1: '',
    Field2: '',
    Field3: '',
    Field4: '',
    Field5: '',
    Field6: '',
    Field7: '',
    Field8: '',
    Field9: '',
    Field10: '',
    Field11: '',
    Field12: '',
    Field13: '',
    Field14: '',
    Field15: '',
  }
  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, apply: false, [name]: value }))
  }

  // handle the apply button for the filters
  const handleFilterApply = () => {
    // on filter apply filterStateRef update to filter current state
    filterStateRef.current = filterState
    handleFilterInputChange('appl', true)
  }
  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter apply filterStateRef update to initial filter state
    filterStateRef.current = initialFilterState
    setFilterState(initialFilterState)
  }

  // create the query object for the API call
  const apiQueryParams: IPersonApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.PersonNo && {
      PersonNo_icontains: filterStateRef.current.PersonNo,
    }),
    ...(filterStateRef.current.FirstName && {
      FirstName_icontains: filterStateRef.current.FirstName,
    }),
    ...(filterStateRef.current.LastName && {
      LastName_icontains: filterStateRef.current.LastName,
    }),

    ...(filterStateRef.current.Email && {
      Email_icontains: filterStateRef.current.Email,
    }),
    ...(filterStateRef.current.PartitionNo &&
      filterStateRef.current.PartitionNo.value && {
        PartitionNo: filterStateRef.current.PartitionNo.value,
      }),
    ...(filterStateRef.current.Field1 && {
      Field1_icontains: filterStateRef.current.Field1,
    }),
    ...(filterStateRef.current.Field2 && {
      Field2_icontains: filterStateRef.current.Field2,
    }),
    ...(filterStateRef.current.Field3 && {
      Field3_icontains: filterStateRef.current.Field3,
    }),
    ...(filterStateRef.current.Field4 && {
      Field4_icontains: filterStateRef.current.Field4,
    }),
    ...(filterStateRef.current.Field5 && {
      Field5_icontains: filterStateRef.current.Field5,
    }),
    ...(filterStateRef.current.Field6 && {
      Field6_icontains: filterStateRef.current.Field6,
    }),
    ...(filterStateRef.current.Field7 && {
      Field7_icontains: filterStateRef.current.Field7,
    }),
    ...(filterStateRef.current.Field8 && {
      Field8_icontains: filterStateRef.current.Field8,
    }),
    ...(filterStateRef.current.Field9 && {
      Field9_icontains: filterStateRef.current.Field9,
    }),
    ...(filterStateRef.current.Field10 && {
      Field10_icontains: filterStateRef.current.Field10,
    }),
    ...(filterStateRef.current.Field11 && {
      Field11_icontains: filterStateRef.current.Field11,
    }),
    ...(filterStateRef.current.Field12 && {
      Field12_icontains: filterStateRef.current.Field12,
    }),
    ...(filterStateRef.current.Field13 && {
      Field13_icontains: filterStateRef.current.Field13,
    }),
    ...(filterStateRef.current.Field14 && {
      Field14_icontains: filterStateRef.current.Field14,
    }),
    ...(filterStateRef.current.Field15 && {
      Field15_icontains: filterStateRef.current.Field15,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data } = useSWR<IListServerResponse<IPersonResult[]>>(
    personApi.list(apiQueryString)
  )

  const isNotFound = !data?.data.length && !isLoading

  return (
    <TableContainer>
      <PersonListModalToolbar
        filterState={filterState}
        handleFilterStateReset={handleFilterStateReset}
        handleFilterApply={handleFilterApply}
        handleInputChange={handleFilterInputChange}
      />
      <Table>
        <TableHeader
          order={order}
          orderBy={orderBy}
          numSelected={selected.length}
          rowCount={data?.data.length}
          handleSort={handleSort}
          handleOrder={handleOrder}
          headerData={TABLE_HEAD}
        />
        <tbody>
          {!isLoading && (
            <>
              {data?.data.map((row) => (
                <PersonListModalRow
                  key={row.PersonNo}
                  row={row}
                  checked={selectedPersonId}
                  setChecked={handleSelectedPerson}
                />
              ))}
              <TableEmptyRows
                emptyRows={data?.data ? emptyRows(page, rowsPerPage, data?.count) : 0}
              />
            </>
          )}
        </tbody>
      </Table>
      <TableBodyLoading isLoading={isLoading} />
      <TableNoData isNotFound={isNotFound} />
      <Pagination
        totalRows={data?.count || 0}
        currentPage={page}
        rowsPerPage={rowsPerPage}
        currentPath={location.pathname}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  )
}

export default PersonListModal
