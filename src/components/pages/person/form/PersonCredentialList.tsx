//@ts-nocheck
import routeProperty from '../../../../routes/routeProperty'
import { IActionsButton } from '../../../../types/components/actionButtons'
import { addIcon, deleteIcon, sendInvitationEmailIcon } from '../../../../utils/icons'

import { useParams } from 'react-router-dom'
import { KeyedMutator } from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest, sendPostRequest } from '../../../../api/swrConfig'
import { credentialApi } from '../../../../api/urls'
import Table from '../../../../components/HOC/style/table/Table'
import TableHeader from '../../../../components/common/table/TableHeader'
import TableNoData from '../../../../components/common/table/TableNoData'
import TableBodyLoading from '../../../../components/loading/table/TableBodyLoading'
import useAlert from '../../../../hooks/useAlert'
import useAuth from '../../../../hooks/useAuth'
import useTable from '../../../../hooks/useTable'
import { ITableHead } from '../../../../types/components/table'
import { ISingleServerResponse } from '../../../../types/pages/common'
import { IParsonCredentials, IPersonResult } from '../../../../types/pages/person'
import executeCallbackIfRowSelected from '../../../../utils/executeCallbackIfRowSelected'
import t from '../../../../utils/translator'
import TableAction from '../../../common/table/TableAction'
import PersonCredentialListRow from './PersonCredentialListRow'
const TABLE_HEAD: ITableHead[] = [
  { id: 'CredentialNo', label: t`Credential No`, filter: false },
  { id: 'FormatNo', label: t`Format`, filter: false },
  { id: 'CredentialNumb', label: t`Credential Number`, filter: false },
  { id: 'CredentialType', label: t`Credential Type`, filter: false },
  { id: 'CredentialStat', label: t`Credential Stat`, filter: false },
]

interface IProps {
  parsonCredentials: IParsonCredentials[]
  isLoading?: boolean
  refetchPersonDetails: KeyedMutator<ISingleServerResponse<IPersonResult>>
  email?: string
}

function PersonCredentialList({
  parsonCredentials,
  isLoading,
  refetchPersonDetails,
  email,
}: IProps) {
  const params = useParams()
  const queryId = params.id as string

  const { license } = useAuth()
  const isSixOptionPresent = license?.Options[5] === '1'

  const { order, orderBy, selected, handleSort, handleOrder, handleSelectRow, handleSelectAllRow } =
    useTable({})

  const { openAlertDialogWithPromise } = useAlert()

  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    credentialApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      onSuccess: () => {
        handleSelectAllRow(false, [])
        refetchPersonDetails()
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
        })
      }
      openAlertDialogWithPromise(handleDelete, { success: t`Success` }, t`Do you want to Delete ?`)
    }
  }

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

  const isNotFound = !parsonCredentials.length && !isLoading

  const commonBreadcrumbsActions: IActionsButton[] = [
    {
      icon: addIcon,
      text: t`Add`,
      link: routeProperty.personCredentialCreate.path(queryId),
      size: 'base',
    },
    {
      color: 'danger',
      icon: deleteIcon,
      text: t`Delete`,
      onClick: () =>
        executeCallbackIfRowSelected(!selected.length, handleDeleteMultiple, 'Select a credential'),
      size: 'base',
      disabled: selected.length === 0,
    },
  ]

  const breadcrumbsActions: IActionsButton[] =
    email && isSixOptionPresent
      ? [
          ...commonBreadcrumbsActions,
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
      : commonBreadcrumbsActions

  return (
    <div className="">
      <TableAction breadcrumbsActions={breadcrumbsActions} />
      <Table>
        <TableHeader
          order={order}
          orderBy={orderBy}
          numSelected={selected.length}
          rowCount={parsonCredentials.length}
          handleSort={handleSort}
          handleOrder={handleOrder}
          selectAllRow={(isAllSelected: boolean) => {
            if (parsonCredentials) {
              handleSelectAllRow(
                isAllSelected,
                parsonCredentials.map((result) => result.CredentialNo.toString())
              )
            }
          }}
          headerData={TABLE_HEAD}
        />
        <tbody className="divide-y divide-gray-200">
          {!isLoading && (
            <>
              {parsonCredentials.map((row) => (
                <PersonCredentialListRow
                  key={row.CredentialNo}
                  row={row}
                  selected={selected}
                  handleSelectRow={handleSelectRow}
                />
              ))}
            </>
          )}
        </tbody>
      </Table>
      <TableBodyLoading isLoading={!!isLoading} />
      <TableNoData isNotFound={isNotFound} />
    </div>
  )
}

export default PersonCredentialList
