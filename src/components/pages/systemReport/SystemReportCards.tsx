import classNames from 'classnames'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { timeApi } from '../../../api/urls'
import routeProperty from '../../../routes/routeProperty'
import { ISingleServerResponse } from '../../../types/pages/common'
import { ISystemStatus } from '../../../types/pages/dashboard'
import { ITimeResult } from '../../../types/pages/time'
import Icon, {
  boardIcon,
  idCard,
  licenseIcon,
  macIcon,
  resetIcon,
  sdCardIcon,
  soapIcon,
  systemIcon,
  timeIcon,
  usbIcon,
} from '../../../utils/icons'
import t from '../../../utils/translator'
import ProgressBar from '../../atomic/ProgressBar'
import SystemReportTime from './SystemReportTime'

type IProps = {
  data?: ISystemStatus
}

function SystemReportCards({ data }: IProps) {
  const { data: timeData } = useSWR<ISingleServerResponse<ITimeResult>>(timeApi.details)

  function calculateFreePercentage(Total?: number, Free?: number): number {
    if (!Total || !Free) {
      return 0
    }
    const usePercentage = ((Total - Free) / Total) * 100
    return Math.round(usePercentage * 100) / 100 // Round to two decimal places
  }

  return (
    // <div className="bg-[#E9E9E9] rounded-xl">
    <div className="border border-gray-200 rounded-xl bg-white">
      <div className="bg-bwTableHeaderBg rounded-t-xl">
        <h2
          className={classNames(
            'px-3 py-3 md:py-4 text-sm font-medium whitespace-nowrap text-bwTableHeaderBgText'
          )}
        >
          {t`Device Information`}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-2 md:gap-8 md:px-10 md:py-8">
        <Link
          to={routeProperty.systemInfo.path()}
          className="flex items-center justify-start gap-4 px-2 py-3 rounded-md md:gap-8 hover:bg-gray-bg"
        >
          <Icon icon={systemIcon} className="w-8 h-8 md:w-9 md:h-9 text-primary" />
          <div className="text-start">
            <h1 className="text-sm font-bold">{t`System Name`}</h1>
            <p className="text-sm">{data?.SystemName}</p>
          </div>
        </Link>

        {/* {!!data?.UsbStorage.Mount && ( */}
        <div className="flex items-center justify-start gap-4 px-2 py-3 rounded-md md:gap-8">
          <Icon icon={usbIcon} className="w-8 h-8 md:w-9 md:h-9 text-primary" />
          <div className="text-start">
            <h1 className="text-sm font-bold">{t`USB Space`}</h1>
            <div className="py-1">
              <ProgressBar
                progress={calculateFreePercentage(data?.UsbStorage.Total, data?.UsbStorage.Free)}
                width={100}
              />
            </div>
            {/* <p className="text-sm">
                {data?.UsbStorage.Free} / {data?.UsbStorage.Total}
              </p> */}
          </div>
        </div>
        {/* )} */}

        {/* {!!data?.SystemStorage.Mount && ( */}
        <div className="flex items-center justify-start gap-4 px-2 py-3 rounded-md md:gap-8">
          <Icon icon={soapIcon} className="w-8 h-8 md:w-9 md:h-9 text-primary" />
          <div className="text-start">
            <h1 className="text-sm font-bold">{t`System Space`}</h1>
            <div className="py-1">
              <ProgressBar
                progress={calculateFreePercentage(
                  data?.SystemStorage.Total,
                  data?.SystemStorage.Free
                )}
                width={100}
              />
            </div>
            {/* <p className="text-sm">
                {data?.SystemStorage.Free} /
                {data?.SystemStorage.Total}
              </p> */}
          </div>
        </div>
        {/* )} */}

        {/* {!!data?.SdStorage.Mount && ( */}
        <div className="flex items-center justify-start gap-4 px-2 py-3 rounded-md md:gap-8">
          <Icon icon={sdCardIcon} className="w-8 h-8 md:w-9 md:h-9 text-primary" />
          <div className="text-start">
            <h1 className="text-sm font-bold">{t`SD Space`}</h1>
            <div className="py-1">
              <ProgressBar
                progress={calculateFreePercentage(data?.SdStorage.Total, data?.SdStorage.Free)}
                width={100}
              />
            </div>
            {/* <p className="text-sm">
                {data?.SdStorage.Free} / {data?.SdStorage.Total}
              </p> */}
          </div>
        </div>
        {/* )} */}

        <Link
          to={routeProperty.timeInfo.path()}
          className="flex items-center justify-start gap-4 px-2 py-3 rounded-md md:gap-8 hover:bg-gray-bg"
        >
          <Icon icon={timeIcon} className="w-8 h-8 md:w-9 md:h-9 text-primary" />
          <div className="text-start">
            <h1 className="text-sm font-bold">{t`Current Time`}</h1>
            {/* <p className="text-sm">
                {formatDate(data?.CurrentTime || "")}
                {time}
              </p> */}
            {timeData && <SystemReportTime timeData={timeData.data} />}
          </div>
        </Link>

        <Link
          to={routeProperty.licenseInfo.path()}
          className="flex items-center justify-start gap-4 px-2 py-3 rounded-md md:gap-8 hover:bg-gray-bg"
        >
          <Icon icon={licenseIcon} className="w-8 h-8 md:w-9 md:h-9 text-primary" />
          <div className="text-start">
            <h1 className="text-sm font-bold">{t`License`}</h1>
            <p className="text-sm">{data?.License}</p>
          </div>
        </Link>

        <div className="flex items-center justify-start gap-4 px-2 py-3 rounded-md md:gap-8">
          <Icon icon={macIcon} className="w-8 h-8 md:w-9 md:h-9 text-primary" />
          <div className="text-start">
            <h1 className="text-sm font-bold">{t`MAC`}</h1>
            <p className="text-sm">{data?.Mac}</p>
          </div>
        </div>

        <Link
          to={routeProperty.update.path()}
          className="flex items-center justify-start gap-4 px-2 py-3 rounded-md md:gap-8 hover:bg-gray-bg"
        >
          <Icon icon={resetIcon} className="w-8 h-8 md:w-9 md:h-9 text-primary" />
          <div className="text-start">
            <h1 className="text-sm font-bold">{t`Version`}</h1>
            <p className="text-sm">{data?.SystemVersion}</p>
          </div>
        </Link>

        <Link
          to={routeProperty.networkInfo.path()}
          className="flex items-center justify-start gap-4 px-2 py-3 rounded-md md:gap-8 hover:bg-gray-bg"
        >
          <Icon icon={idCard} className="w-8 h-8 md:w-9 md:h-9 text-primary" />
          <div className="text-start">
            <h1 className="text-sm font-bold">{t`Address`}</h1>
            <p className="text-sm">{data?.IpAddress}</p>
          </div>
        </Link>

        <div className="flex items-center justify-start gap-4 px-2 py-3 rounded-md md:gap-8">
          <Icon icon={boardIcon} className="w-8 h-8 md:w-9 md:h-9 text-primary" />
          <div className="text-start">
            <h1 className="text-sm font-bold">{t`Board`}</h1>
            <p className="text-sm">{data?.Board1}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemReportCards
