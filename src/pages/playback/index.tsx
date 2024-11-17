import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { homeApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import CardModal from '../../components/HOC/modal/CardModal'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import PlaybackTableToolbar from '../../components/pages/playback/CameraTableToolbar'
import PlaybackViewBox from '../../components/pages/playback/PlaybackViewBox'
import RecordSelectModal from '../../components/pages/playback/RecordSelectModal'
import routeProperty from '../../routes/routeProperty'
import { THandleFilterInputChange } from '../../types/components/common'
import { IStreamResult } from '../../types/pages/camera'
import { ICommandResponse, ISingleServerResponse } from '../../types/pages/common'
import { IPlaybackFilters } from '../../types/pages/playback'
import { nodeIcon } from '../../utils/icons'
import { promiseToast } from '../../utils/toast'
import t from '../../utils/translator'

function convertTime(inputTime: string): string {
  const inputDate = new Date(inputTime)
  return `${inputDate.getFullYear()}-${String(inputDate.getMonth() + 1).padStart(2, '0')}-${String(
    inputDate.getDate()
  ).padStart(2, '0')} ${String(inputDate.getHours()).padStart(2, '0')}:${String(
    inputDate.getMinutes()
  ).padStart(2, '0')}:${String(inputDate.getSeconds()).padStart(2, '0')}`
}

function Playback() {
  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IPlaybackFilters = {
    Apply: false,
    Channel: null,
    NvrType: null,
    Time: null,
    Stream: null,
    SelectedRecordedTime: '',
    RecordTime: '',
  }
  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)
  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  const [selectedTimeDates, setSelectedTimeDates] = useState<string[]>([])
  // const [selectedRecordedTime, setSelectedRecordedTime] = useState<string>('')

  // State to store the selected hour and minute
  const [selectedHour, setSelectedHour] = useState<string>('')
  const [selectedMinute, setSelectedMinute] = useState<string>('')

  // State to keep track of whether getting the streaming URL failed
  const [isStreamGetUrlFailed, setIsStreamGetUrlFailed] = useState<boolean>(false)

  // State to store streaming data received from the server
  const [streamingData, setStreamingData] = useState<IStreamResult>({
    StreamingUrl: '',
    StreamingId: '',
  })

  // State to manage the current streaming type ('main' or 'sub')
  const [currentStreamingType, setCurrentStreamingType] = useState<'main' | 'sub'>('main')

  // State to store whether show select time modal or not
  const [showSelectTimeModal, setShowSelectTimeModal] = useState(false)

  // Set default Channel
  // useDefaultChannelOption<IPlaybackFilters>(setFilterState) // setting default channel from toolbar

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
    if (name === 'RecordTime' && typeof value === 'string') {
      // add other nvr time in selected time
      setFilterState((state) => ({ ...state, Apply: false, RecordTime: convertTime(value) }))
    }
  }

  // handle the apply button for the filters
  const handleFilterApply = () => {
    // on filter apply filterStateRef update to filter current state
    filterStateRef.current = filterState
    // updateFilterStateToQuery()
    handleFilterInputChange('Apply', true)
    getStreamUrl({
      Stream: currentStreamingType,
      Time: filterStateRef.current.SelectedRecordedTime,
      ChannelNo: filterStateRef.current.Channel?.value,
    })
    setShowSelectTimeModal(false)
  }

  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter apply filterStateRef update to initial filter state
    // filterStateRef.current = initialFilterState
    setFilterState(filterStateRef.current)
    // updateFilterStateToQuery()
    // setFilterState(initialFilterState)
    setShowSelectTimeModal(false)
  }

  const { isLoading, data, mutate, isValidating } = useSWR<ICommandResponse<string[]>>(
    filterState.Channel ? homeApi.playback(`ChannelNo=${filterState.Channel.value}`) : null
    // {
    //   onSuccess: () => {
    //     handleFilterInputChange('Apply', false)
    //   },
    // }
  )

  const handleReloadData = () => {
    promiseToast(mutate(), { success: `Success` })
  }

  useEffect(() => {
    if (data?.cgi?.data?.length) {
      const lastDate = data?.cgi.data[data?.cgi.data.length - 1].split(' ')[0]
      handleFilterInputChange('Time', {
        label: lastDate,
        value: lastDate,
      })
    }
  }, [data])

  useEffect(() => {
    if (data?.cgi?.data?.length) {
      const recordedDates =
        data?.cgi?.data?.filter((recordedTime) =>
          recordedTime.includes(filterState.Time?.value || '')
        ) || []
      setSelectedTimeDates(recordedDates)
      const firstRecordedTime = recordedDates[0]
      if (firstRecordedTime) {
        setSelectedHour(firstRecordedTime.slice(11, 13))
        setSelectedMinute(firstRecordedTime.slice(14, 16))
      }
    }
  }, [filterState.Time?.value])

  useEffect(() => {
    if (selectedTimeDates.length) {
      const firstRecordedTime = selectedTimeDates.find((recordedTime) =>
        recordedTime.includes(`${filterState.Time?.value} ${selectedHour}`)
      )
      if (firstRecordedTime) {
        setSelectedMinute(firstRecordedTime.slice(14, 16))
      }
    }
  }, [selectedHour])

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

  // const isNotFound = !data?.cgi?.data?.length && !isLoading && !isValidating

  return (
    <Page>
      <Breadcrumbs
        pageRoutes={[
          {
            href: routeProperty.playback.path(),
            text: t`Playback`,
          },
        ]}
      />
      <TableContainer>
        <PlaybackTableToolbar
          // filterState={filterState}
          // handleInputChange={handleFilterInputChange}
          handleShowSelectTimeModal={() => setShowSelectTimeModal(true)}
          // handleShowGoToTimeModal={() => setShowGoToTimeModal(true)}
          // handleReloadData={handleReloadData}
        />
        {/* <div className="hidden lg:block">
          <CameraTimeSelector
            selectedHour={selectedHour}
            setSelectedHour={setSelectedHour}
            selectedMinute={selectedMinute}
            setSelectedMinute={setSelectedMinute}
            selectedDateRecordedTimes={selectedTimeDates}
            selectedRecordedTime={selectedRecordedTime}
            setSelectedRecordedTime={setSelectedRecordedTime}
          />
        </div> */}
        <div className="max-w-5xl mx-auto w-full pt-4 bg-white rounded-md md:px-4">
          {/* {selectedRecordedTime && (
            <div className="flex items-center justify-center h-64">
              <h1 className="text-2xl font-semibold text-gray-500">{t('Please, Select A Time')}</h1>
            </div>
          )} */}
          {/* {isNotFound ? (
            <div className="flex items-center justify-center h-64">
              <h1 className="text-2xl font-semibold text-gray-500">{t('No Record Found!')}</h1>
            </div>
          ) : ( */}
          <PlaybackViewBox
            name={filterStateRef.current.Channel?.label}
            deviceId={filterState.Channel?.value}
            // setSelectedHour={setSelectedHour}
            // setSelectedMinute={setSelectedMinute}
            // selectedDateRecordedTimes={selectedTimeDates}
            // selectedRecordedTime={selectedRecordedTime}
            // setSelectedRecordedTime={setSelectedRecordedTime}
            filterStateRef={filterStateRef}
            isLoading={isLoading}
            isStreamGetUrlFailed={isStreamGetUrlFailed}
            setIsStreamGetUrlFailed={setIsStreamGetUrlFailed}
            streamingData={streamingData}
            setStreamingData={setStreamingData}
            currentStreamingType={currentStreamingType}
            setCurrentStreamingType={setCurrentStreamingType}
            getStreamUrl={getStreamUrl}
            getStreamUrlIsLoading={getStreamUrlIsLoading}
          />
          {/* )} */}
        </div>
      </TableContainer>
      <CardModal
        icon={nodeIcon}
        headerTitle={t`Record Select`}
        openModal={showSelectTimeModal}
        setOpenModal={setShowSelectTimeModal}
        // widthClass="max-w-7xl"
      >
        <RecordSelectModal
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          selectedMinute={selectedMinute}
          setSelectedMinute={setSelectedMinute}
          filterState={filterState}
          handleInputChange={handleFilterInputChange}
          recordedDates={data?.cgi.data || []}
          selectedDateRecordedTimes={selectedTimeDates}
          handleReloadData={handleReloadData}
          isLoading={isLoading}
          // selectedRecordedTime={selectedRecordedTime}
          // setSelectedRecordedTime={setSelectedRecordedTime}
          handleApply={handleFilterApply}
          handleModalClose={handleFilterStateReset}
        />
      </CardModal>
      {/* <Modal
        openModal={showGoToTimeModal}
        setOpenModal={setShowGoToTimeModal}
        // widthClass="min-w-[90vw] max-full"
      >
        <RecordGoToModal
          selectedOtherNVRTime={selectedOtherNVRTime}
          handleOtherNvrFilterChange={handleOtherNvrFilterChange}
          isLoading={isLoading}
          handleApply={getGoToTimeStreamUrlTrigger}
          handleModalClose={() => setShowGoToTimeModal(false)}
        />
      </Modal> */}
    </Page>
  )
}

export default Playback
