import { formatApi } from '../../../../api/urls'
import Table from '../../../../components/HOC/style/table/Table'
import TableContainer from '../../../../components/HOC/style/table/TableContainer'
import Pagination from '../../../../components/common/table/Pagination'
import TableEmptyRows from '../../../../components/common/table/TableEmptyRows'
import TableHeader from '../../../../components/common/table/TableHeader'
import TableNoData from '../../../../components/common/table/TableNoData'
import TableBodyLoading from '../../../../components/loading/table/TableBodyLoading'
import useTable, { emptyRows } from '../../../../hooks/useTable'
import QueryString from 'qs'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../../types/components/common'
import { ITableHead } from '../../../../types/components/table'
import { IListServerResponse } from '../../../../types/pages/common'
import {
  IFormatApiQueryParams,
  IFormatFilters,
  IFormatResult,
} from '../../../../types/pages/format'
import FormatListModalRow from './FormatListModalRow'
import FormatListModalToolbar from './FormatListModalToolbar'
import t from '../../../../utils/translator'

interface IProps {
  selectedFormatId: string
  handleSelectedFormat: (_format: IFormatResult) => void
}

function FormatListModal({ selectedFormatId, handleSelectedFormat }: IProps) {
  const location = useLocation()

  const { page, rowsPerPage, order, orderBy, selected, handleChangePage, handleSort, handleOrder } =
    useTable({ defaultOrderBy: 'FormatNo' })

  const TABLE_HEAD = useMemo<ITableHead[]>(
    () => [
      { id: 'FormatNo', label: t`Format No`, filter: false },
      { id: 'FormatName', label: t`Format Name`, filter: true },
      { id: 'TotalLength', label: t`Total  Length`, filter: true },
      { id: 'FacilityCode', label: t`Facility Code`, filter: true },
      { id: 'radio', label: t``, filter: false },
    ],
    []
  )

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IFormatFilters = {
    Apply: false,
    FormatNo: '',
    FormatName: '',
    TotalLength: '',
    FacilityCode: '',
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
    handleFilterInputChange('apply', true)
  }
  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter apply filterStateRef update to initial filter state
    filterStateRef.current = initialFilterState
    setFilterState(initialFilterState)
  }

  // create the query object for the API call
  const apiQueryParams: IFormatApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.FormatNo && {
      FormatNo_icontains: filterStateRef.current.FormatNo,
    }),
    ...(filterStateRef.current.FormatName && {
      FormatName_icontains: filterStateRef.current.FormatName,
    }),
    ...(filterStateRef.current.TotalLength && {
      TotalLength_icontains: filterStateRef.current.TotalLength,
    }),
    ...(filterStateRef.current.FacilityCode && {
      FacilityCode_icontains: filterStateRef.current.FacilityCode,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data } = useSWR<IListServerResponse<IFormatResult[]>>(
    formatApi.list(apiQueryString)
  )

  const isNotFound = !data?.data.length && !isLoading

  return (
    <TableContainer>
      <FormatListModalToolbar
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
                <FormatListModalRow
                  key={row.FormatNo}
                  row={row}
                  checked={selectedFormatId}
                  setChecked={handleSelectedFormat}
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

export default FormatListModal
