import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IDeviceStatuses } from '../../../types/pages/dashboard'
import Icon, {
  cameraIcon,
  channelIcon,
  contLockIcon,
  doorIcon,
  elevatorIcon,
  facegateIcon,
  inputIcon,
  intercomIcon,
  locksetIcon,
  nodeIcon,
  outputIcon,
  relayIcon,
  subnodeIcon,
} from '../../../utils/icons'
import t from '../../../utils/translator'
import TableData from '../../HOC/style/table/TableData'
import TableNoData from '../../common/table/TableNoData'
import TableBodyLoading from '../../loading/table/TableBodyLoading'

const TABLE_HEAD = [
  { id: 'icon', label: t``, align: 'left' },
  { id: 'device', label: t`Device`, align: 'left' },
  { id: 'Total', label: t`Total` },
  { id: 'Online', label: t('Online') },
  { id: 'Offline', label: t`Offline` },
  { id: 'Normal', label: t`Normal` },
  { id: 'Alert', label: t`Active` },
]

type IProps = {
  data?: IDeviceStatuses
  isLoading: boolean
}

function SystemReportList({ data, isLoading }: IProps) {
  const { has_license } = useAuth()

  const isNotFound = !data && !isLoading
  const navigate = useNavigate()

  return (
    <div className="flex flex-col overflow-y-hidden ">
      <div className="overflow-x-auto overflow-y-hidden sm:mx-0.5 lg:mx-0.5 rounded-xl border border-gray-200">
        <div className="min-w-full">
          <div className="overflow-x-auto ">
            <table className="min-w-full even:bg-gray-50 odd:bg-white">
              <thead className="bg-bwTableHeaderBg">
                <tr className="">
                  {TABLE_HEAD.map((item) => (
                    <th
                      key={item.id}
                      scope="col"
                      className={classNames(
                        'px-3 py-3 md:py-4 text-sm font-medium whitespace-nowrap text-bwTableHeaderBgText',
                        item.align === 'left' && 'text-left'
                      )}
                    >
                      {item.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data && (
                  <>
                    <tr
                      onClick={() => navigate(routeProperty.node.path())}
                      className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                      style={{ height: 42 }}
                    >
                      <TableData>
                        <Icon icon={nodeIcon} className="text-sm md:text-l text-primary" />
                      </TableData>
                      <TableData align="left">{t`Node`}</TableData>
                      <TableData>{data?.Node.Total}</TableData>
                      <TableData>{data?.Node.Online}</TableData>
                      <TableData>{data?.Node.Offline}</TableData>
                      <TableData>{data?.Node.Normal}</TableData>
                      <TableData>{data?.Node.Alert}</TableData>
                    </tr>
                    <tr
                      onClick={() => navigate(routeProperty.door.path())}
                      className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                      style={{ height: 42 }}
                    >
                      <TableData>
                        <Icon icon={doorIcon} className="text-sm md:text-l text-primary" />
                      </TableData>
                      <TableData align="left">{t`Door`}</TableData>
                      <TableData>{data?.Door.Total}</TableData>
                      <TableData>{data?.Door.Online}</TableData>
                      <TableData>{data?.Door.Offline}</TableData>
                      <TableData>{data?.Door.Normal}</TableData>
                      <TableData>{data?.Door.Alert}</TableData>
                    </tr>
                    {/* <tr
                      onClick={() => navigate(routeProperty.region.path())}
                      className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                      style={{ height: 42 }}
                    >
                      <TableData>
                        <Icon icon={regionIcon} className="text-sm md:text-l text-primary" />
                      </TableData>
                      <TableData align="left">{t`Region`}</TableData>
                      <TableData>{data?.Region.Total}</TableData>
                      <TableData>{data?.Region.Online}</TableData>
                      <TableData>{data?.Region.Offline}</TableData>
                      <TableData>{data?.Region.Normal}</TableData>
                      <TableData>{data?.Region.Alert}</TableData>
                    </tr> */}

                    <tr
                      onClick={() => navigate(routeProperty.input.path())}
                      className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                      style={{ height: 42 }}
                    >
                      <TableData>
                        <Icon icon={inputIcon} className="text-sm md:text-l text-primary" />
                      </TableData>
                      <TableData align="left">{t`Input`}</TableData>
                      <TableData>{data?.Input.Total}</TableData>
                      <TableData>{data?.Input.Online}</TableData>
                      <TableData>{data?.Input.Offline}</TableData>
                      <TableData>{data?.Input.Normal}</TableData>
                      <TableData>{data?.Input.Alert}</TableData>
                    </tr>

                    <tr
                      onClick={() => navigate(routeProperty.output.path())}
                      className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                      style={{ height: 42 }}
                    >
                      <TableData>
                        <Icon icon={outputIcon} className="text-sm md:text-l text-primary" />
                      </TableData>
                      <TableData align="left">{t`Output`}</TableData>
                      <TableData>{data?.Output.Total}</TableData>
                      <TableData>{data?.Output.Online}</TableData>
                      <TableData>{data?.Output.Offline}</TableData>
                      <TableData>{data?.Output.Normal}</TableData>
                      <TableData>{data?.Output.Alert}</TableData>
                    </tr>

                    <tr
                      onClick={() => navigate(routeProperty.elevator.path())}
                      className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                      style={{ height: 42 }}
                    >
                      <TableData>
                        <Icon icon={elevatorIcon} className="text-sm md:text-l text-primary" />
                      </TableData>
                      <TableData align="left">{t`Elevator`}</TableData>
                      <TableData>{data?.Elevator.Total}</TableData>
                      <TableData>{data?.Elevator.Online}</TableData>
                      <TableData>{data?.Elevator.Offline}</TableData>
                      <TableData>{data?.Elevator.Normal}</TableData>
                      <TableData>{data?.Elevator.Alert}</TableData>
                    </tr>
                    <tr
                      onClick={() => navigate(routeProperty.relay.path())}
                      className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                      style={{ height: 42 }}
                    >
                      <TableData>
                        <Icon icon={relayIcon} className="text-sm md:text-l text-primary" />
                      </TableData>
                      <TableData align="left">{t`Relay`}</TableData>
                      <TableData>{data?.Relay.Total}</TableData>
                      <TableData>{data?.Relay.Online}</TableData>
                      <TableData>{data?.Relay.Offline}</TableData>
                      <TableData>{data?.Relay.Normal}</TableData>
                      <TableData>{data?.Relay.Alert}</TableData>
                    </tr>

                    {has_license('Camera') && (
                      <tr
                        onClick={() => navigate(routeProperty.camera.path())}
                        className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                        style={{ height: 42 }}
                      >
                        <TableData>
                          <Icon icon={cameraIcon} className="text-sm md:text-l text-primary" />
                        </TableData>
                        <TableData align="left">{t`Camera`}</TableData>
                        <TableData>{data?.Camera.Total}</TableData>
                        <TableData>{data?.Camera.Online}</TableData>
                        <TableData>{data?.Camera.Offline}</TableData>
                        <TableData>{data?.Camera.Normal}</TableData>
                        <TableData>{data?.Camera.Alert}</TableData>
                      </tr>
                    )}

                    {/* <tr
                          onClick={() => navigate(routeProperty.gateway.path())}
                          className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                          style={{ height: 42 }}
                        >
                          <TableData>
                            <Icon icon={gatewayIcon} className="text-sm md:text-l text-primary" />
                          </TableData>
                          <TableData align="left">{t`Gateway`}</TableData>
                          <TableData>{data?.Gateway.Total}</TableData>
                          <TableData>{data?.Gateway.Online}</TableData>
                          <TableData>{data?.Gateway.Offline}</TableData>
                          <TableData>{data?.Gateway.Normal}</TableData>
                          <TableData>{data?.Gateway.Alert}</TableData>
                        </tr> */}
                    {has_license('Channel') && (
                      <tr
                        onClick={() => navigate(routeProperty.channel.path())}
                        className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                        style={{ height: 42 }}
                      >
                        <TableData>
                          <Icon icon={channelIcon} className="text-sm md:text-l text-primary" />
                        </TableData>
                        <TableData align="left">{t`Channel`}</TableData>
                        <TableData>{data?.Channel.Total}</TableData>
                        <TableData>{data?.Channel.Online}</TableData>
                        <TableData>{data?.Channel.Offline}</TableData>
                        <TableData>{data?.Channel.Normal}</TableData>
                        <TableData>{data?.Channel.Alert}</TableData>
                      </tr>
                    )}

                    {has_license('Lockset') && (
                      <tr
                        onClick={() => navigate(routeProperty.lockset.path())}
                        className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                        style={{ height: 42 }}
                      >
                        <TableData>
                          <Icon icon={locksetIcon} className="text-sm md:text-l text-primary" />
                        </TableData>
                        <TableData align="left">{t`Lockset`}</TableData>
                        <TableData>{data?.Lockset.Total}</TableData>
                        <TableData>{data?.Lockset.Online}</TableData>
                        <TableData>{data?.Lockset.Offline}</TableData>
                        <TableData>{data?.Lockset.Normal}</TableData>
                        <TableData>{data?.Lockset.Alert}</TableData>
                      </tr>
                    )}

                    {has_license('Facegate') && (
                      <tr
                        //start fixed letter spelling.
                        onClick={() => navigate(routeProperty.facegate.path())}
                        //end ----Imran
                        className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                        style={{ height: 42 }}
                      >
                        <TableData>
                          <Icon icon={facegateIcon} className="text-sm md:text-l text-primary" />
                        </TableData>
                        <TableData align="left">{t`Facegate`}</TableData>
                        <TableData>{data?.Facegate.Total}</TableData>
                        <TableData>{data?.Facegate.Online}</TableData>
                        <TableData>{data?.Facegate.Offline}</TableData>
                        <TableData>{data?.Facegate.Normal}</TableData>
                        <TableData>{data?.Facegate.Alert}</TableData>
                      </tr>
                    )}

                    {has_license('Subnode') && (
                      <tr
                        onClick={() => navigate(routeProperty.subnode.path())}
                        className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                        style={{ height: 42 }}
                      >
                        <TableData>
                          <Icon icon={subnodeIcon} className="text-sm md:text-l text-primary" />
                        </TableData>
                        <TableData align="left">{t`Subnode`}</TableData>
                        <TableData>{data?.Subnode.Total}</TableData>
                        <TableData>{data?.Subnode.Online}</TableData>
                        <TableData>{data?.Subnode.Offline}</TableData>
                        <TableData>{data?.Subnode.Normal}</TableData>
                        <TableData>{data?.Subnode.Alert}</TableData>
                      </tr>
                    )}

                    {has_license('ContLock') && (
                      <tr
                        onClick={() => navigate(routeProperty.contLock.path())}
                        className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                        style={{ height: 42 }}
                      >
                        <TableData>
                          <Icon icon={contLockIcon} className="text-sm md:text-l text-primary" />
                        </TableData>
                        <TableData align="left">{t`ContLock`}</TableData>
                        <TableData>{data?.ContLock.Total}</TableData>
                        <TableData>{data?.ContLock.Online}</TableData>
                        <TableData>{data?.ContLock.Offline}</TableData>
                        <TableData>{data?.ContLock.Normal}</TableData>
                        <TableData>{data?.ContLock.Alert}</TableData>
                      </tr>
                    )}

                    {has_license('Intercom') && (
                      <tr
                        onClick={() => navigate(routeProperty.intercom.path())}
                        className="bg-white border-b border-gray-200 cursor-pointer custom_transition group border-x border-x-white hover:border-x-gray-200 hover:bg-gray-100 last:border-b-0"
                        style={{ height: 42 }}
                      >
                        <TableData>
                          <Icon icon={intercomIcon} className="text-sm md:text-l text-primary" />
                        </TableData>
                        <TableData align="left">{t`Intercom`}</TableData>
                        <TableData>{data?.Intercom.Total}</TableData>
                        <TableData>{data?.Intercom.Online}</TableData>
                        <TableData>{data?.Intercom.Offline}</TableData>
                        <TableData>{data?.Intercom.Normal}</TableData>
                        <TableData>{data?.Intercom.Alert}</TableData>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
            <TableBodyLoading
              isLoading={isLoading}
              tableRowPerPage={12}
              tableRowHeight={42}
              sideBorder={false}
            />
            <TableNoData isNotFound={isNotFound} tableRowPerPage={12} tableRowHeight={42} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemReportList
