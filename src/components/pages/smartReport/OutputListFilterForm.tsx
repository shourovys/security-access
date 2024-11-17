import { useState } from 'react'
import { THandleFilterInputChange } from '../../../types/components/common'
import { ISmartReportFilters, LogKeysOptions } from '../../../types/pages/SmartReport'
import { listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import FormCardWithHeader from '../../HOC/FormCardWithHeader'
import MultiSelect from '../../common/form/MultiSelect'

interface IProps {
  filterState: ISmartReportFilters
  handleInputChange: THandleFilterInputChange
}

function OutputListFilterForm({ filterState, handleInputChange }: IProps) {
  const [show, setShow] = useState(false)

  const handleShow = (name: string, checked: boolean) => {
    setShow(checked)
  }
  return (
    <FormCardWithHeader
      icon={listIcon}
      header={t`Output List`}
      twoPart={false}
      selectName="AccessSelect"
      isSelected={show}
      handleSelect={handleShow}
      showChidden={show}
    >
      <MultiSelect
        name="OutputList"
        label={t`Output List`}
        options={LogKeysOptions}
        value={filterState?.OutputList}
        onChange={handleInputChange}
        gridColSpan2
      />
    </FormCardWithHeader>
  )
}

export default OutputListFilterForm
