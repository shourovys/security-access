import { useMemo } from 'react'
import useSWR from 'swr'
import { contGateApi } from '../../../../api/urls'
import Table from '../../../../components/HOC/style/table/Table'
import TableContainer from '../../../../components/HOC/style/table/TableContainer'
import TableHeader from '../../../../components/common/table/TableHeader'
import TableNoData from '../../../../components/common/table/TableNoData'
import TableBodyLoading from '../../../../components/loading/table/TableBodyLoading'
import useTable from '../../../../hooks/useTable'
import { ITableHead } from '../../../../types/components/table'
import { ISingleServerResponse } from '../../../../types/pages/common'
import { IContGateDiscoverResult } from '../../../../types/pages/contGate'
import t from '../../../../utils/translator'
import ContGateDiscoverListModalRow from './ContGateDiscoverListModalRow'

interface IProps {
  selectedDiscover: string
  handleSelectDiscover: (_discover: IContGateDiscoverResult) => void
}

function ContGateDiscoverListModal({ selectedDiscover, handleSelectDiscover }: IProps) {
  const { order, orderBy, selected, handleSort, handleOrder } = useTable({
    defaultOrderBy: 'PersonNo',
  })

  const TABLE_HEAD = useMemo<ITableHead[]>(
    () => [
      { id: 'MacAddress', label: t`Mac Address`, filter: false },
      { id: 'IpAddress', label: t`IP Address`, filter: false },
      { id: 'ApiPort', label: t`API Port`, filter: false },
      { id: 'Ready', label: t`Ready`, filter: false },
      { id: 'radio', label: t``, filter: false },
    ],
    []
  )

  const { isLoading, isValidating, data } = useSWR<
    ISingleServerResponse<IContGateDiscoverResult[]>
  >(contGateApi.discover)

  const isNotFound = !data?.data.length && !isValidating

  return (
    <TableContainer>
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
          {!isValidating && (
            <>
              {data?.data.map((row) => (
                <ContGateDiscoverListModalRow
                  key={row.MacAddress}
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

export default ContGateDiscoverListModal
