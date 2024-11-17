import QueryString from 'qs'
import { useMemo } from 'react'
import useSWR from 'swr'
import { locksetApi } from '../../../../api/urls'
import Table from '../../../../components/HOC/style/table/Table'
import TableContainer from '../../../../components/HOC/style/table/TableContainer'
import TableHeader from '../../../../components/common/table/TableHeader'
import TableNoData from '../../../../components/common/table/TableNoData'
import TableBodyLoading from '../../../../components/loading/table/TableBodyLoading'
import useTable from '../../../../hooks/useTable'
import { ITableHead } from '../../../../types/components/table'
import { ISingleServerResponse } from '../../../../types/pages/common'
import { ILocksetDiscoverResult } from '../../../../types/pages/lockset'
import t from '../../../../utils/translator'
import LocksetDiscoverListModalRow from './LocksetDiscoverListModalRow'

interface IProps {
  GatewayNo?: string
  selectedDiscover: string
  handleSelectDiscover: (_discover: ILocksetDiscoverResult) => void
}

function LocksetDiscoverListModal({ GatewayNo, selectedDiscover, handleSelectDiscover }: IProps) {
  const { order, orderBy, selected, handleSort, handleOrder } = useTable({
    defaultOrderBy: 'PersonNo',
  })

  const TABLE_HEAD = useMemo<ITableHead[]>(
    () => [
      { id: 'linkId', label: t`Link ID`, filter: false },
      { id: 'deviceName', label: t`Device Name`, filter: false },
      { id: 'modelType', label: t`Modal Type`, filter: false },
      { id: 'deviceId', label: t`Device Id`, filter: false },
      { id: 'linkCommStatus', label: t`Comm Status`, filter: false },
      { id: 'signalQuality', label: t`Signal Quality`, filter: false },
      { id: 'radio', label: t``, filter: false },
    ],
    []
  )

  // create the query object for the API call
  const apiQueryParams = {
    // sort_by: orderBy,
    // order,
    GatewayNo,
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, isValidating, data } = useSWR<
    ISingleServerResponse<{ linkList?: ILocksetDiscoverResult[] }>
  >(GatewayNo ? locksetApi.discover(apiQueryString) : null)

  const isNotFound = !data?.data?.linkList?.length && !isValidating
  return (
    <TableContainer>
      <Table>
        <TableHeader
          order={order}
          orderBy={orderBy}
          numSelected={selected.length}
          rowCount={data?.data?.linkList?.length}
          handleSort={handleSort}
          handleOrder={handleOrder}
          headerData={TABLE_HEAD}
        />
        <tbody>
          {!isValidating && (
            <>
              {data?.data?.linkList?.map((row) => (
                <LocksetDiscoverListModalRow
                  key={row.linkId}
                  row={row}
                  checked={selectedDiscover}
                  setChecked={handleSelectDiscover}
                />
              ))}
            </>
          )}
        </tbody>
      </Table>
      <TableBodyLoading isLoading={isValidating} />
      <TableNoData isNotFound={isNotFound} />
    </TableContainer>
  )
}

export default LocksetDiscoverListModal
