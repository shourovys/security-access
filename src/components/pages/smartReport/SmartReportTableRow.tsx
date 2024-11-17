import routeProperty from '../../../routes/routeProperty'
import { ILogResult } from '../../../types/pages/log'
import { formatDateTimeTzView } from '../../../utils/formetTime'
import Modal from '../../HOC/modal/Modal'
import TableData from '../../HOC/style/table/TableData'
import TableRow from '../../HOC/style/table/TableRow'
import StreamModal from '../../common/Stream/StreamModal'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon, { credentialIcon, formatIcon, recordOnIcon } from '../../../utils/icons'

type IProps = {
  row: ILogResult
  Reference?: string
  showColumns: (keyof ILogResult)[]
}

function SmartReportTableRow({ row, Reference, showColumns }: IProps) {
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

  // Create an array to hold JSX elements for each column
  const tableCells = showColumns.map((column) => {
    const checkColumn = typeof column !== 'string' && Array.isArray(column) ? column[0] : column
    switch (checkColumn) {
      case 'LogNo':
        return <TableData key="LogNo">{row.LogNo}</TableData>
      case 'Partition':
        return <TableData key="Partition">{row?.Partition?.PartitionName}</TableData>
      case 'Format':
        return <TableData key="Format">{row?.Format?.FormatName}</TableData>
      case 'Credential':
        return <TableData key="Credential">{row?.Credential?.CredentialName}</TableData>
      case 'Person':
        return <TableData key="Person">{row.Person?.PersonName}</TableData>
      case 'Region':
        return <TableData key="Region">{row.Region?.RegionName}</TableData>
      case 'Channel':
        return <TableData key="Channel">{row.Channel?.ChannelName}</TableData>
      case 'PartitionNo':
        return <TableData key="PartitionNo">{row.PartitionNo}</TableData>
      case 'LogTime':
        return <TableData key="LogTime">{formatDateTimeTzView(row.LogTime)}</TableData>
      case 'EventTime':
        return <TableData key="EventTime">{formatDateTimeTzView(row.EventTime)}</TableData>
      case 'EventCode':
        return <TableData key="EventCode">{row.EventCode}</TableData>
      case 'EventName':
        return <TableData key="EventName">{renderEventName()}</TableData>
      case 'DeviceType':
        return <TableData key="DeviceType">{row.DeviceType}</TableData>
      case 'DeviceNo':
        return <TableData key="DeviceNo">{row.DeviceNo}</TableData>
      case 'DeviceName':
        return <TableData key="DeviceName">{row.DeviceName}</TableData>
      case 'FormatNo':
        return <TableData key="FormatNo">{row.FormatNo}</TableData>
      case 'CredentialNumb':
        return <TableData key="CredentialNumb">{row.CredentialNumb}</TableData>
      case 'CredentialNo':
        return <TableData key="CredentialNo">{row.CredentialNo}</TableData>
      case 'PersonNo':
        return <TableData key="PersonNo">{row.PersonNo}</TableData>
      case 'PersonName':
        return <TableData key="PersonName">{row.PersonName}</TableData>
      case 'ReaderPort':
        return <TableData key="ReaderPort">{row.ReaderPort}</TableData>
      case 'RegionNo':
        return <TableData key="RegionNo">{row.RegionNo}</TableData>
      case 'ChannelNo':
        return <TableData key="ChannelNo">{row.ChannelNo}</TableData>
      case 'Message':
        return <TableData key="Message">{row.Message}</TableData>
      case 'AckRequired':
        return <TableData key="AckRequired">{row.AckRequired}</TableData>
      case 'AckTime':
        return <TableData key="AckTime">{row.AckTime}</TableData>
      case 'AckUser':
        return <TableData key="AckUser">{row.AckUser}</TableData>
      case 'Comment':
        return <TableData key="Comment">{row.Comment}</TableData>
      case 'LogSent':
        return <TableData key="LogSent">{row.LogSent}</TableData>
      default:
        return null
    }
  })

  return (
    <>
      <TableRow
        key={row.LogNo}
        link={Reference ? routeProperty.logInfo.path(row.LogNo.toString(), Reference) : undefined}
      >
        {tableCells}
      </TableRow>
      {/* Stream modal */}
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

export default SmartReportTableRow
