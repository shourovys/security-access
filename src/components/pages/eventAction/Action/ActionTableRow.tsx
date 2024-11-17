import TableData from '../../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../../components/HOC/style/table/TableRow'
import Checkbox from '../../../../components/atomic/Checkbox'
import { useActionElementSelectData } from '../../../../hooks/useSelectData'
import routeProperty from '../../../../routes/routeProperty'
import { IActionResult, actionTypesObject } from '../../../../types/pages/eventAndAction'

type IProps = {
  row: IActionResult
  selected: string[]
  handleSelectRow: (selectedId: string) => void
  eventActionId: string
  // actionControlOptionsState: IActionControlOptions
}

function ActionTableRow({
  row,
  selected,
  handleSelectRow,
  eventActionId,
}: // actionControlOptionsState,
IProps) {
  const { data } = useActionElementSelectData(false, row.ActionType)
  return (
    <TableRow
      key={row.ActionNo}
      link={routeProperty.actionInfo.path(eventActionId, row.ActionNo)}
      selected={selected.indexOf(row.ActionNo.toString() ?? '') !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.ActionNo.toString() ?? '') !== -1}>
        <Checkbox
          value={`select-row-${row.ActionNo}`}
          checked={selected.indexOf(row.ActionNo.toString() ?? '') !== -1}
          onChange={() => {
            handleSelectRow(row.ActionNo.toString() ?? '')
          }}
        />
      </TableDataAction>
      <TableData>{row.ActionNo}</TableData>
      <TableData>{actionTypesObject[row.ActionType]}</TableData>
      <TableData>
        {data?.data.ActionControls?.length &&
          data?.data.ActionControls.find((control) => control.value === row.ActionCtrl)?.text}
      </TableData>

      {/* <TableData>
        {actionControlOptionsState[row.ActionType] &&
          findSelectOption(actionControlOptionsState[row.ActionType], row.ActionCtrl)?.label}
      </TableData> */}
      <TableData>{row.Items?.map((item) => item.ItemName).join(', ')}</TableData>
    </TableRow>
  )
}
export default ActionTableRow
