import TableData from '../../../components/HOC/style/table/TableData'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { ILogResult } from '../../../types/pages/log'
import { formatDateTimeTzView } from '../../../utils/formetTime'
import Modal from '../../HOC/modal/Modal'
import StreamModal from '../../common/Stream/StreamModal'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon, { credentialIcon, formatIcon, recordOnIcon } from '../../../utils/icons'

type IProps = {
  row: ILogResult
  Reference?: string
}

function LogReportTableRow({ row, Reference }: IProps) {
  // Define the state for manage stream modal state
  const [streamModal, setStreamModal] = useState<boolean>(false)

  const renderEventName = () => {
    if (row.EventCode === 232 || row.EventCode === 632) {
      const url = `${routeProperty.formatCreate.path()}/?CardData=${row.Message}`
      return (
        <div
          className=""
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <Link to={url} className="flex items-center justify-center gap-2">
            <Icon icon={formatIcon} />
            <span>{row.EventName}</span>
          </Link>
        </div>
      )
    } else if (row.EventCode === 235 || row.EventCode === 635) {
      const url = `${routeProperty.credentialCreate.path()}/?FormatNo=${row.FormatNo}&CardNumber=${
        row.CredentialNumb
      }`
      return (
        <div
          className=""
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <Link to={url} className="flex items-center justify-center gap-2">
            <Icon icon={credentialIcon} />
            <span>{row.EventName}</span>
          </Link>
        </div>
      )
    } else if (row.ChannelNo !== 0) {
      return (
        <div
          className=""
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <div
            className="flex items-center justify-center gap-2"
            onClick={() => setStreamModal(true)}
          >
            <Icon icon={recordOnIcon} />
            <span>{row.EventName}</span>
          </div>
        </div>
      )
    } else {
      return row.EventName
    }
  }

  return (
    <>
      <TableRow
        key={row.LogNo}
        link={Reference ? routeProperty.logInfo.path(row.LogNo.toString(), Reference) : undefined}
      >
        <TableData>{row.LogNo}</TableData>
        <TableData>{formatDateTimeTzView(row.EventTime)}</TableData>
        <TableData>{renderEventName()}</TableData>
        <TableData>{row.DeviceName}</TableData>
        <TableData>{row.PersonName}</TableData>
      </TableRow>

      {/* stream modal */}
      <Modal openModal={streamModal} setOpenModal={setStreamModal}>
        <StreamModal
          type="channel"
          name={row.Channel?.ChannelName}
          deviceId={row.Channel?.ChannelNo?.toString()}
          setOpenModal={setStreamModal}
        />
      </Modal>
    </>
  )
}

export default LogReportTableRow
