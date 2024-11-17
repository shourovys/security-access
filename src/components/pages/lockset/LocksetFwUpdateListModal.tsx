import { useMemo, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../../api/swrConfig'
import { locksetApi } from '../../../api/urls'
import Table from '../../../components/HOC/style/table/Table'
import TableContainer from '../../../components/HOC/style/table/TableContainer'
import TableHeader from '../../../components/common/table/TableHeader'
import TableNoData from '../../../components/common/table/TableNoData'
import TableBodyLoading from '../../../components/loading/table/TableBodyLoading'
import useTable from '../../../hooks/useTable'
import { ITableHead } from '../../../types/components/table'
import { IFwUpdateResult, ISingleServerResponse } from '../../../types/pages/common'
import { editSuccessfulToast, promiseToast } from '../../../utils/toast'
import t from '../../../utils/translator'
import FwUpdateListModalRow from '../../common/FwUpdateListModalRow'

interface IProps {
  LocksetNo?: string
  setOpenModal: (openModal: boolean) => void
}

function LocksetFwUpdateListModal({ LocksetNo, setOpenModal }: IProps) {
  const { order, orderBy, selected, handleSort, handleOrder } = useTable({
    defaultOrderBy: 'PersonNo',
  })

  const TABLE_HEAD = useMemo<ITableHead[]>(
    () => [
      { id: 'Name', label: t`FW Name`, filter: false },
      { id: 'ReleaseDate', label: t`Release Date`, filter: false },
      { id: 'Version', label: t`Version`, filter: false },
      { id: 'radio', label: t``, filter: false },
    ],
    []
  )

  // Define state variables for sleeted FW
  const [selectedFwId, setSelectedFwId] = useState('')

  const { isLoading, isValidating, data } = useSWR<ISingleServerResponse<IFwUpdateResult[]>>(
    LocksetNo ? locksetApi.fwUpdate(LocksetNo) : null
  )

  // Define the mutation function to send the form data to the server
  const { trigger } = useSWRMutation(
    LocksetNo ? locksetApi.fwUpdate(LocksetNo) : null,
    sendPostRequest,
    {
      onSuccess: () => {
        editSuccessfulToast()
      },
    }
  )

  // update FW on FW select
  const fwUpdateOnSelect = (selectedFW: IFwUpdateResult) => {
    setOpenModal(false)
    setSelectedFwId(selectedFW.Name)
    promiseToast(
      trigger({
        DeviceType: selectedFW.DeviceType,
        LinksHref: selectedFW.Links[0].Href,
        Version: selectedFW.Version,
      }),
      { success: `Success` }
    )
  }

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
                <FwUpdateListModalRow
                  key={row.Name}
                  row={row}
                  checked={selectedFwId}
                  setChecked={fwUpdateOnSelect}
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

export default LocksetFwUpdateListModal
