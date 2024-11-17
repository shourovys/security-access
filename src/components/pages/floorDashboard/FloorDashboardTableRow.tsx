import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../../components/HOC/modal/Modal'
import TableData from '../../../components/HOC/style/table/TableData'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { ILogResult } from '../../../types/pages/log'
import { formatDateTimeTzView, getPlaybackRecordedTime } from '../../../utils/formetTime'
import Icon, { credentialIcon, formatIcon, recordOnIcon } from '../../../utils/icons'
import FloorDashboardPlayback from './FloorDashboardPlayback'

type IProps = {
  row: ILogResult
}

function FloorDashboardTableRow({ row }: IProps) {
  // Define the state for manage stream modal state
  // const [streamModal, setStreamModal] = useState<boolean>(false)
  const [playbackModal, setPlaybackModal] = useState<boolean>(false)

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
            onClick={() => setPlaybackModal(true)}
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
      <TableRow key={row.LogNo} link={routeProperty.logInfo.path(row.LogNo, 1)}>
        <TableData>{row.LogNo}</TableData>
        <TableData>{formatDateTimeTzView(row.EventTime)}</TableData>
        <TableData>{renderEventName()}</TableData>
        <TableData>{row.DeviceName}</TableData>
        <TableData>{row.PersonName}</TableData>
      </TableRow>
      {/* playback modal */}
      <Modal openModal={playbackModal} setOpenModal={setPlaybackModal}>
        <FloorDashboardPlayback
          SelectedRecordedTime={getPlaybackRecordedTime(row.EventTime)}
          Channel={
            row.Channel?.ChannelName
              ? {
                  label: row.Channel?.ChannelName,
                  value: row.Channel?.ChannelNo.toString(),
                }
              : null
          }
          setOpenModal={setPlaybackModal}
        />
      </Modal>
      {/* stream modal
      <Modal openModal={streamModal} setOpenModal={setStreamModal}>
        <StreamModal
          type="channel"
          name={row.Channel?.ChannelName}
          deviceId={row.Channel?.ChannelNo?.toString()}
          setOpenModal={setStreamModal}
        />
      </Modal> */}
    </>
  )
}

export default FloorDashboardTableRow
