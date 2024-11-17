import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'

import Input from '../../atomic/Input'
import t from '../../../utils/translator'

function ArkTableToolbar() {
  // const handleInputChange = (name: string, value: string | TSelectValue): void => {
  //   // console.log(name, value)
  // }
  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input name="comment" />
      </div>
    </TableToolbarContainer>
  )
}

export default ArkTableToolbar
