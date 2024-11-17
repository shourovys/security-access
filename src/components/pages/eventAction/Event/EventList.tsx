// @ts-nocheck
import QueryString from 'qs'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../../../api/swrConfig'
import { eventApi } from '../../../../api/urls'
import Table from '../../../../components/HOC/style/table/Table'
import TableEmptyRows from '../../../../components/common/table/TableEmptyRows'
import TableHeader from '../../../../components/common/table/TableHeader'
import TableNoData from '../../../../components/common/table/TableNoData'
import TableBodyLoading from '../../../../components/loading/table/TableBodyLoading'
import useAlert from '../../../../hooks/useAlert'
import useTable, { emptyRows } from '../../../../hooks/useTable'
import routeProperty from '../../../../routes/routeProperty'
import { IActionsButton } from '../../../../types/components/actionButtons'
import { ITableHead } from '../../../../types/components/table'
import { IApiQueryParamsBase, IListServerResponse } from '../../../../types/pages/common'
import { IEventResult } from '../../../../types/pages/eventAndAction'
import executeCallbackIfRowSelected from '../../../../utils/executeCallbackIfRowSelected'
import { addIcon, deleteIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import TableAction from '../../../common/table/TableAction'
import EventTableRow from './EventTableRow'

const TABLE_HEAD: ITableHead[] = [
  { id: 'EventNo', label: t`Event No`, filter: false },
  { id: 'EventType', label: t`Event Type`, filter: false },
  { id: 'EventWhats', label: t`Event Code`, filter: false },
  { id: 'EventItems', label: t`Event Item`, filter: false },
]

// Component to show list of a eventAction items
function EventList() {
  // Get the eventAction ID from the router query
  const params = useParams()
  const eventActionId = params.id as string

  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    selected,
    handleSort,
    handleOrder,
    handleSelectRow,
    handleSelectAllRow,
  } = useTable({})
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // state to store deleted rows ids
  const [isDeletedIds, setIsDeletedIds] = useState<string[]>([])

  // query object of pagination, sorting, filtering
  const apiQueryParams: IApiQueryParamsBase = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    // query for fetch table data after delete row
    ...(isDeletedIds.length && {
      isDeletedIds: JSON.stringify(isDeletedIds),
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data } = useSWR<IListServerResponse<IEventResult[]>>(
    eventApi.list(eventActionId, apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    eventApi.deleteMultiple(eventActionId),
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

  // Define the actions for the Form card header
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: addIcon,
      text: t`Add`,
      link: routeProperty.eventCreate.path(eventActionId),
      size: 'base',
    },
    {
      color: 'danger',
      icon: deleteIcon,
      text: t`Delete`,
      onClick: () =>
        executeCallbackIfRowSelected(!selected.length, handleDeleteMultiple, 'Select an Item'),
      size: 'base',
      disabled: selected.length === 0,
    },
  ]
  const isNotFound = !data?.data.length && !isLoading
  // const shouldShowIcon = !!null;

  return (
    <div>
      {/* <FormCardWithHeader
     icon={shouldShowIcon}
      header={t``}
      twoPart={false}
      headerActionButtons={headerActionButtons}
    /> */}
      <TableAction breadcrumbsActions={breadcrumbsActions} />
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
                data?.data.map((result) => result.EventNo.toString())
              )
            }
          }}
          headerData={TABLE_HEAD}
        />
        <tbody>
          {!isLoading && (
            <>
              {data?.data.map((row) => (
                <EventTableRow
                  key={row.EventNo}
                  row={row}
                  selected={selected}
                  handleSelectRow={handleSelectRow}
                  eventActionId={eventActionId}
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
    </div>
  )
}

export default EventList
