import QueryString from 'qs'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { nodeApi } from '../../api/urls'
import TableHeader from '../../components/common/table/TableHeader'
import TableNoData from '../../components/common/table/TableNoData'
import Page from '../../components/HOC/Page'
import Table from '../../components/HOC/style/table/Table'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TableBodyLoading from '../../components/loading/table/TableBodyLoading'
import NodeAddTableRow from '../../components/pages/node/NodeAddTableRow'
import useTable from '../../hooks/useTable'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { ITableHead } from '../../types/components/table'
import { ISingleServerResponse } from '../../types/pages/common'
import { ITempResult } from '../../types/pages/node'
import { applyIcon, cancelIcon, clearIcon, refreshIcon } from '../../utils/icons'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { addSuccessfulToast, errorToast, warningToast } from '../../utils/toast'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'TempNo', label: t`Temp No`, filter: true },
  { id: 'NodeType', label: t`Node Type`, filter: true },
  { id: 'Elevator', label: t`Elevator`, filter: true },
  { id: 'Mac', label: t`MAC`, filter: true },
  { id: 'Product', label: t`Product`, filter: true },
  { id: 'Model', label: t`Model`, filter: true },
  { id: 'Type', label: t`Type`, filter: true },
  { id: 'Version', label: t`Version`, filter: true },
  { id: 'Address', label: t`Address`, filter: true },
  { id: 'Timezone', label: t`Time Zone`, filter: true },
]

// Component to create a Node
function CreateNode() {
  const navigate = useNavigate()

  const {
    rowsPerPage,
    order,
    orderBy,
    selected,
    handleSort,
    handleOrder,
    handleSelectRow,
    handleSelectAllRow,
  } = useTable({ defaultOrderBy: TABLE_HEAD[0].id })

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // query object of sorting
  const apiQueryParams = {
    sort_by: orderBy,
    order,
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<ISingleServerResponse<ITempResult[]>>(
    nodeApi.tempList(apiQueryString)
  )

  // Define the mutation function to save the selected temp data to the server
  const { trigger, isMutating } = useSWRMutation(nodeApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to node list page on success
      navigate(routeProperty.node.path())
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        if (error.response.data.errors.non_field_errors) {
          warningToast(error.response.data.errors.non_field_errors[0])
        }
        return
      }
      serverErrorHandler(error)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // If there are errors, display them and do not submit the form
    if (!selected.length) {
      errorToast(`Please select record`)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      TempNos: selected,
    }

    trigger(modifiedFormData)
  }

  // mutation for clear all temp data
  const { trigger: clearAllTrigger, isMutating: clearAllLoading } = useSWRMutation(
    nodeApi.clearAll,
    sendPostRequest,
    {
      onSuccess: () => {
        mutate() // refresh the data
        addSuccessfulToast(`Success`)
      },
    }
  )

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: clearIcon,
      text: t`Clear All`,
      onClick: () => {
        clearAllTrigger({})
      },
      isLoading: clearAllLoading,
    },
    {
      color: 'danger',
      icon: refreshIcon,
      text: t`Refresh`,
      onClick: () => {
        mutate().then(() => {
          addSuccessfulToast(`Success`)
          // clear the selected
          handleSelectAllRow(false, [])
        })
      },
      isLoading: isLoading,
    },
  ]

  const breadcrumbsActionsButtons: IActionsButton[] = [
    {
      color: 'apply',
      icon: applyIcon,
      text: t`Apply`,
      onClick: handleSubmit,
      isLoading: isMutating,
    },
    {
      color: 'cancel',
      icon: cancelIcon,
      text: t`Cancel`,
      link: routeProperty.node.path(),
    },
  ]

  const isNotFound = !data?.data?.length && !isLoading

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
      />
      <div className="pt-2" />
      <TableContainer>
        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            numSelected={selected.length}
            rowCount={data?.data?.length}
            handleSort={handleSort}
            handleOrder={handleOrder}
            selectAllRow={(isAllSelected: boolean) => {
              if (data?.data) {
                handleSelectAllRow(
                  isAllSelected,
                  data?.data?.map((result) => result.TempNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody>
            {!isLoading && (
              <>
                {data?.data?.map((row) => (
                  <NodeAddTableRow
                    key={row.TempNo}
                    row={row}
                    selected={selected}
                    handleSelectRow={handleSelectRow}
                  />
                ))}
                {/* <TableEmptyRows
                  emptyRows={data?.data ? emptyRows(page, rowsPerPage, data?.count) : 0}
                /> */}
              </>
            )}
          </tbody>
        </Table>
        <TableBodyLoading isLoading={isLoading} tableRowPerPage={rowsPerPage} />
        <TableNoData isNotFound={isNotFound} />
        {/* <Pagination
          totalRows={data?.count || 0}
          currentPage={page}
          rowsPerPage={rowsPerPage}
          currentPath={location.pathname}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </TableContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.node.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateNode
