import { useState } from 'react'
import useSWR from 'swr'
import { personApi } from '../../../api/urls'
import { THandleFilterInputChange } from '../../../types/components/common'
import { ISmartReportFilters } from '../../../types/pages/SmartReport'
import { IListServerResponse } from '../../../types/pages/common'
import { IPersonResult } from '../../../types/pages/person'
import { SERVER_QUERY } from '../../../utils/config'
import { listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import FormCardWithHeader from '../../HOC/FormCardWithHeader'
import MultiSelect from '../../common/form/MultiSelect'

interface IProps {
  filterState: ISmartReportFilters
  handleInputChange: THandleFilterInputChange
}

function PersonListFilterForm({ filterState, handleInputChange }: IProps) {
  const [show, setShow] = useState(false)

  const handleShow = (name: string, checked: boolean) => {
    setShow(checked)
  }

  // Fetch elements by type from the server
  const { isLoading: personIsLoading, data: personData } = useSWR<
    IListServerResponse<IPersonResult[]>
  >(personApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <FormCardWithHeader
      icon={listIcon}
      header={t`Person List`}
      twoPart={false}
      selectName="AccessSelect"
      isSelected={show}
      handleSelect={handleShow}
      showChidden={show}
    >
      <MultiSelect
        name="PersonIds"
        label={t`Person List`}
        options={personData?.data.map((item) => ({
          id: item.PersonNo.toString(),
          label: `${item.FirstName} ${item.MiddleName} ${item.LastName}`,
        }))}
        value={filterState?.PersonIds}
        onChange={handleInputChange}
        isLoading={personIsLoading}
        gridColSpan2
      />
    </FormCardWithHeader>
  )
}

export default PersonListFilterForm
