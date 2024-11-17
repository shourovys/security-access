import { useRef, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../../api/swrConfig'
import { homeApi } from '../../../api/urls'
import PlaybackViewBox from '../../../components/pages/playback/PlaybackViewBox'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IIconButton } from '../../../types/components/iocnButton'
import { IStreamResult } from '../../../types/pages/camera'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IPlaybackFilters } from '../../../types/pages/playback'
import { cancelIcon } from '../../../utils/icons'
import { ISelectOption } from '../../atomic/Selector'

function convertTime(inputTime: string): string {
  const inputDate = new Date(inputTime)
  return `${inputDate.getFullYear()}-${String(inputDate.getMonth() + 1).padStart(2, '0')}-${String(
    inputDate.getDate()
  ).padStart(2, '0')} ${String(inputDate.getHours()).padStart(2, '0')}:${String(
    inputDate.getMinutes()
  ).padStart(2, '0')}:${String(inputDate.getSeconds()).padStart(2, '0')}`
}

interface IProps {
  SelectedRecordedTime: string
  Channel: ISelectOption | null
  setOpenModal: (openModal: boolean) => void
}

function FloorDashboardPlayback({ Channel, SelectedRecordedTime, setOpenModal }: IProps) {
  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IPlaybackFilters = {
    Apply: false,
    Channel: Channel,
    NvrType: null,
    Time: null,
    Stream: null,
    SelectedRecordedTime: SelectedRecordedTime,
    RecordTime: '',
  }
  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)
  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  // State to keep track of whether getting the streaming URL failed
  const [isStreamGetUrlFailed, setIsStreamGetUrlFailed] = useState<boolean>(false)

  // State to store streaming data received from the server
  const [streamingData, setStreamingData] = useState<IStreamResult>({
    StreamingUrl: '',
    StreamingId: '',
  })

  // State to manage the current streaming type ('main' or 'sub')
  const [currentStreamingType, setCurrentStreamingType] = useState<'main' | 'sub'>('main')

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
    if (name === 'RecordTime' && typeof value === 'string') {
      // add other nvr time in selected time
      setFilterState((state) => ({ ...state, Apply: false, RecordTime: convertTime(value) }))
    }
  }

  // SWR Mutation hook to get the stream URL from the server
  const { trigger: getStreamUrl, isMutating: getStreamUrlIsLoading } = useSWRMutation(
    homeApi.getPlaybackStream,
    sendPostRequest,
    {
      onSuccess: (data: ISingleServerResponse<IStreamResult | string>) => {
        if (typeof data.data !== 'string') {
          const { StreamingId, StreamingUrl } = data.data
          setIsStreamGetUrlFailed(false)
          setStreamingData({ StreamingId, StreamingUrl })
        }
        handleFilterInputChange('Apply', false)
      },
      onError: (error) => {
        setIsStreamGetUrlFailed(true)
      },
    }
  )

  // Header icon buttons
  const headerIconButtons: IIconButton[] = [
    {
      icon: cancelIcon,
      onClick: () => setOpenModal(false),
    },
  ]

  return (
    <PlaybackViewBox
      name={filterStateRef.current.Channel?.label}
      deviceId={filterState.Channel?.value}
      filterStateRef={filterStateRef}
      isLoading={false}
      isStreamGetUrlFailed={isStreamGetUrlFailed}
      setIsStreamGetUrlFailed={setIsStreamGetUrlFailed}
      streamingData={streamingData}
      setStreamingData={setStreamingData}
      currentStreamingType={currentStreamingType}
      setCurrentStreamingType={setCurrentStreamingType}
      getStreamUrl={getStreamUrl}
      getStreamUrlIsLoading={getStreamUrlIsLoading}
      headerIconButtons={headerIconButtons}
    />
  )
}

export default FloorDashboardPlayback
