import QueryString from 'qs'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { contLockApi } from '../../../../api/urls'
import Table from '../../../../components/HOC/style/table/Table'
import TableContainer from '../../../../components/HOC/style/table/TableContainer'
import TableHeader from '../../../../components/common/table/TableHeader'
import TableNoData from '../../../../components/common/table/TableNoData'
import TableBodyLoading from '../../../../components/loading/table/TableBodyLoading'
import useTable from '../../../../hooks/useTable'
import { ITableHead } from '../../../../types/components/table'
import { ISingleServerResponse } from '../../../../types/pages/common'
import { IContLockDiscoverResult } from '../../../../types/pages/contLock'
import t from '../../../../utils/translator'
import ContLockDiscoverListModalRow from './ContLockDiscoverListModalRow'

interface IProps {
  ContGateNo?: string
  selectedDiscover: string
  handleSelectDiscover: (_discover: IContLockDiscoverResult) => void
}

function ContLockDiscoverListModal({ ContGateNo, selectedDiscover, handleSelectDiscover }: IProps) {
  const { order, orderBy, selected, handleSort, handleOrder } = useTable({
    defaultOrderBy: 'PersonNo',
  })

  const TABLE_HEAD = useMemo<ITableHead[]>(
    () => [
      { id: 'RFAddress', label: t`RF Address`, filter: false },
      { id: 'LockID', label: t`Lock ID`, filter: false },
      { id: 'RSSISend', label: t`RSSI Send`, filter: false },
      { id: 'RSSIRecv', label: t`RSSI Recv`, filter: false },
      // { id: 'LockType', label: t`	Lock Type`, filter: false },
      // { id: 'LockStatus', label: t`Lock Status`, filter: false },
      // { id: 'CodeVersion', label: t`Code Version`, filter: false },
      { id: 'Assigned', label: t`Assigned`, filter: false },
      { id: 'radio', label: t``, filter: false },
    ],
    []
  )

  // Create the query object for the API call
  const apiQueryParams = {
    ContGateNo,
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, isValidating, data } = useSWR<
    ISingleServerResponse<IContLockDiscoverResult[]>
  >(ContGateNo ? contLockApi.discover(apiQueryString) : null)

  const isNotFound = !data?.data.length && !isValidating

  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout>()
  const [remainingTime, setRemainingTime] = useState<number>(60)

  useEffect(() => {
    // Start the countdown timer when loading begins
    if (isValidating) {
      const timeout = setTimeout(() => {
        setRemainingTime((prevTime) => prevTime - 1)
      }, 1000) // Update every second
      setLoadingTimeout(timeout)
    } else {
      // Clear the timeout if loading completes
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
    }
  }, [isValidating, remainingTime])

  useEffect(() => {
    // Clear timeout and reset timer when loading completes
    if (!isValidating) {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
      setRemainingTime(60)
    }
  }, [isValidating])

  return (
    <TableContainer>
      {isValidating && (
        <p className="w-full pb-2.5 text-gray-500  font-semibold text-center">
          Wait please... {remainingTime}{' '}
        </p>
      )}
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
                <ContLockDiscoverListModalRow
                  key={row.LockID}
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

export default ContLockDiscoverListModal
