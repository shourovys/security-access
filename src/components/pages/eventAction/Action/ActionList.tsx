// @ts-nocheck
import { sendMultiDeleteRequest } from '../../../../api/swrConfig'
import { actionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Table from '../../../../components/HOC/style/table/Table'
import TableEmptyRows from '../../../../components/common/table/TableEmptyRows'
import TableHeader from '../../../../components/common/table/TableHeader'
import TableNoData from '../../../../components/common/table/TableNoData'
import TableBodyLoading from '../../../../components/loading/table/TableBodyLoading'
import useAlert from '../../../../hooks/useAlert'
import useTable, { emptyRows } from '../../../../hooks/useTable'
import QueryString from 'qs'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import routeProperty from '../../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../../types/components/actionButtons'
import { ITableHead } from '../../../../types/components/table'
import { IApiQueryParamsBase, IListServerResponse } from '../../../../types/pages/common'
import { IActionResult } from '../../../../types/pages/eventAndAction'
import executeCallbackIfRowSelected from '../../../../utils/executeCallbackIfRowSelected'
import { addIcon, deleteIcon, listIcon } from '../../../../utils/icons'
import ActionTableRow from './ActionTableRow'
import t from '../../../../utils/translator'
import TableAction from '../../../common/table/TableAction'

const TABLE_HEAD: ITableHead[] = [
  { id: 'ActionNo', label: t`Action No`, filter: false },
  { id: 'ActionType', label: t`Action Type`, filter: false },
  { id: 'ActionCtrl', label: t`Action Control`, filter: false },
  { id: 'ActionItems', label: t`Action Item`, filter: false },
]

// Component to show list of a eventAction items
function ActionList() {
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

  const { isLoading, data } = useSWR<IListServerResponse<IActionResult[]>>(
    actionApi.list(eventActionId, apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    actionApi.deleteMultiple(eventActionId),
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
      link: routeProperty.actionCreate.path(eventActionId),
      size: 'base',
    },
    {
      color: 'danger',
      icon: deleteIcon,
      text: t('Delete'),
      onClick: () =>
        executeCallbackIfRowSelected(!selected.length, handleDeleteMultiple, 'Select an Item'),
      size: 'base',
      disabled: selected.length === 0,
    },
  ]
  const isNotFound = !data?.data.length && !isLoading

  return (
    //Modified Button position according to doc-design--rubel
    <div>
      {/* <FormCardWithHeader
      icon={listIcon}
      header={t`Action`}
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
                data?.data.map((result) => result.ActionNo.toString())
              )
            }
          }}
          headerData={TABLE_HEAD}
        />
        <tbody>
          {!isLoading && (
            <>
              {data?.data.map((row) => (
                <ActionTableRow
                  key={row.ActionNo}
                  row={row}
                  selected={selected}
                  handleSelectRow={handleSelectRow}
                  eventActionId={eventActionId}
                // actionControlOptionsState={actionControlOptionsState}
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

export default ActionList
