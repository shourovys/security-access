import { formatApi } from '../../../api/urls'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IListServerResponse } from '../../../types/pages/common'
import {
  ICredentialFilters,
  credentialStatsOptions,
  credentialTypesOptions,
} from '../../../types/pages/credential'
import { IFormatResult } from '../../../types/pages/format'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import { SERVER_QUERY } from '../../../utils/config'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'

interface IProps {
  filterState: ICredentialFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function CredentialTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const { isLoading: formatIsLoading, data: formatData } = useSWR<
    IListServerResponse<IFormatResult[]>
  >(formatApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="CredentialNo"
          type="number"
          placeholder={t`Credential No`}
          value={filterState.CredentialNo}
          onChange={handleInputChange}
        />
        <Selector
          name="Format"
          placeholder={t`Format`}
          value={filterState.Format}
          options={formatData?.data.map((result) => ({
            value: result.FormatNo.toString(),
            label: result.FormatName,
          }))}
          isClearable
          onChange={handleInputChange}
          isLoading={formatIsLoading}
        />
        <Input
          name="CredentialNumb"
          placeholder={t`Credential Number`}
          value={filterState.CredentialNumb}
          onChange={handleInputChange}
        />
        <Selector
          name="CredentialType"
          placeholder={t`Credential Type`}
          value={filterState.CredentialType}
          options={credentialTypesOptions}
          isClearable
          onChange={handleInputChange}
        />
        <Selector
          name="CredentialStat"
          placeholder={t`Credential Stat`}
          value={filterState.CredentialStat}
          options={credentialStatsOptions}
          isClearable
          onChange={handleInputChange}
        />
        {/* <Input
          name="LastName"
          placeholder={t`Last Name`}
          value={filterState.LastName}
          onChange={handleInputChange}
        />
        <Input
          name="FirstName"
          placeholder={t`First Name`}
          value={filterState.FirstName}
          onChange={handleInputChange}
        />
        <Input
          name="Email"
          placeholder={t`Email`}
          value={filterState.Email}
          onChange={handleInputChange}
        /> */}
        {/* <Selector
          name="PersonNo"
          placeholder={t`Credential Owner`}
          value={filterState.PersonNo}
          options={personData?.data.map((result) => ({
            value: result.PersonNo.toString(),
            label: result.LastName,
          }))}
          isClearable
          onChange={handleInputChange}
          isLoading={personIsLoading}
        /> */}
      </div>

      <div className="flex gap-3.5 lg:gap-4">
        <Button onClick={handleFilterApply}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button color="cancel" onClick={handleFilterStateReset}>
          <Icon icon={resetIcon} />
          <span>{t`Reset`}</span>
        </Button>
      </div>
    </TableToolbarContainer>
  )
}

export default CredentialTableToolbar
