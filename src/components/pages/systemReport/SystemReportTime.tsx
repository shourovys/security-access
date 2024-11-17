import useClock from '../../../hooks/useClock'
import { ITimeResult } from '../../../types/pages/time'
import { formatDateTimeView } from '../../../utils/formetTime'

type IProps = {
  timeData: ITimeResult
}

function SystemReportTime({ timeData }: IProps) {
  const { currentTime, utcOffsetString } = useClock({
    Timezone: timeData.Timezone,
    CurrentTime: timeData.CurrentTime,
  })

  return (
    <p
      className="text-sm"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: currentTime ? `${formatDateTimeView(currentTime)} (${utcOffsetString})` : '--',
      }}
    />
  )
}

export default SystemReportTime
