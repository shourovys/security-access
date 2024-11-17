import { useState } from 'react'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import t from '../../../utils/translator'

function ActReportTableToolbar() {
  const [state] = useState({
    logNo: '',
    eventTime: '',
    eventName: '',
    deviceName: '',
    personName: '',
    actTime: '',
    actUser: '',
  })
  // const handleInputChange = (name: string, value: string): void => {
  //   // console.log(name, value)
  // }
  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input name="logNo" placeholder={t`Log No`} value={state.logNo} />
        <Input
          name="eventTime"
          placeholder={t`Event Time`}
          value={state.eventTime}
          // onChange={handleInputChange}
        />
        <Input
          name="eventName"
          placeholder={t`Event Name`}
          value={state.eventName}
          // onChange={handleInputChange}
        />
        <Input
          name="deviceName"
          placeholder={t`Device Name`}
          value={state.deviceName}
          // onChange={handleInputChange}
        />
        <Input
          name="personName"
          placeholder={t`Person Name`}
          value={state.personName}
          // onChange={handleInputChange}
        />
        <Input
          name="actTime"
          placeholder={t`ACT Time`}
          value={state.actTime}
          // onChange={handleInputChange}
        />
        <Input
          name="actUser"
          placeholder={t`ACT User`}
          value={state.actUser}
          // onChange={handleInputChange}
        />
      </div>
      <div className="flex gap-3.5 lg:gap-4">
        <Button>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button color="cancel">
          <Icon icon={resetIcon} />
          <span>{t`Reset`}</span>
        </Button>
      </div>
    </TableToolbarContainer>
  )
}

export default ActReportTableToolbar
