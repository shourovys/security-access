import React, { useEffect, useRef, useState } from 'react'
import useSWRMutation, { TriggerWithOptionsArgs } from 'swr/mutation'
import { sendPostRequest } from '../../../api/swrConfig'
import { channelApi } from '../../../api/urls'
import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import { IActionsButton } from '../../../types/components/actionButtons'
import { IIconButton } from '../../../types/components/iocnButton'
import { IStreamResult } from '../../../types/pages/camera'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IPlaybackFilters } from '../../../types/pages/playback'
import { STREAM_URL } from '../../../utils/config'
import { channelIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import LiveBox from '../live/LiveBox'
import RecordedTimeSelector from './RecordedTimeSelector'

interface IProps {
  name?: string | null
  deviceId?: string | null
  // setSelectedHour: React.Dispatch<React.SetStateAction<string>>
  // setSelectedMinute: React.Dispatch<React.SetStateAction<string>>
  // selectedDateRecordedTimes: string[]
  // selectedRecordedTime: string
  // setSelectedRecordedTime: React.Dispatch<React.SetStateAction<string>>
  filterStateRef: React.MutableRefObject<IPlaybackFilters>
  isLoading?: boolean
  isStreamGetUrlFailed: boolean
  setIsStreamGetUrlFailed: React.Dispatch<React.SetStateAction<boolean>>
  streamingData: IStreamResult
  setStreamingData: React.Dispatch<React.SetStateAction<IStreamResult>>
  currentStreamingType: 'main' | 'sub'
  setCurrentStreamingType: React.Dispatch<React.SetStateAction<'main' | 'sub'>>
  getStreamUrl: TriggerWithOptionsArgs<
    ISingleServerResponse<string | IStreamResult>,
    any,
    string,
    unknown
  >
  getStreamUrlIsLoading: boolean
  headerIconButtons?: IIconButton[]
}

const PlaybackViewBox: React.FC<IProps> = ({
  name,
  deviceId,
  // setSelectedHour,
  // setSelectedMinute,
  // selectedDateRecordedTimes,
  // selectedRecordedTime,
  // setSelectedRecordedTime,
  filterStateRef,
  isLoading,
  isStreamGetUrlFailed,
  // setIsStreamGetUrlFailed,
  streamingData,
  // setStreamingData,
  currentStreamingType,
  setCurrentStreamingType,
  getStreamUrl,
  getStreamUrlIsLoading,
  headerIconButtons,
}) => {
  // State to manage the current streaming type ('main' or 'sub')
  // const [currentStreamingType, setCurrentStreamingType] = useState<'main' | 'sub'>('main')

  // State to store streaming data received from the server
  // const [streamingData, setStreamingData] = useState<IStreamResult>({
  //   StreamingUrl: '',
  //   StreamingId: '',
  // })

  // State to keep track of whether getting the streaming URL failed
  // const [isStreamGetUrlFailed, setIsStreamGetUrlFailed] = useState<boolean>(false)

  // State to keep track of whether the stream is generated and available
  const [isStreamIsGenerated, setIsStreamIsGenerated] = useState<boolean>(false)

  // State to keep track of the number of attempts to check if the stream is generated
  const [countOfCheckIsStreamIsGenerated, setCountOfCheckIsStreamIsGenerated] = useState<number>(0)

  // Ref to hold the interval for controlling streaming
  const streamControlIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Ref to hold the interval for retrying to get stream URL
  const retryStreamGetUrlIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Ref to hold the interval for checking if the stream is generated
  const checkStreamIsGeneratedIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // API URL for fetching stream data based on the component's 'isLoading' prop
  // const streamReqUrl = !isLoading && deviceId ? homeApi.getPlaybackStream : null

  // SWR Mutation hook to get the stream URL from the server
  // const { trigger: getStreamUrl, isMutating: getStreamUrlIsLoading } = useSWRMutation(
  //   homeApi.getPlaybackStream,
  //   sendPostRequest,
  //   {
  //     onSuccess: (data: ISingleServerResponse<IStreamResult | string>) => {
  //       if (typeof data.data !== 'string') {
  //         const { StreamingId, StreamingUrl } = data.data
  //         setIsStreamGetUrlFailed(false)
  //         setStreamingData({ StreamingId, StreamingUrl })
  //       }
  //     },
  //     onError: (error) => {
  //       setIsStreamGetUrlFailed(true)
  //     },
  //   }
  // )

  // API URL for controlling streaming on the server
  const controlStreamingReqUrl =
    streamingData.StreamingId && deviceId ? channelApi.controlStreaming : null

  // SWR Mutation hook to trigger controlling streaming
  const { trigger: controlStreamingTrigger } = useSWRMutation(
    controlStreamingReqUrl,
    sendPostRequest,
    {
      onError: () => {
        if (retryStreamGetUrlIntervalRef.current) {
          clearInterval(retryStreamGetUrlIntervalRef.current)
          if (checkStreamIsGeneratedIntervalRef.current) {
            clearInterval(checkStreamIsGeneratedIntervalRef.current)
          }
        }
      },
    }
  )

  // Function to call control streaming action with the given streamingId
  const callControlStreaming = (streamingId: string) => {
    controlStreamingTrigger({
      StreamingId: streamingId,
      Action: 'continue',
    })
  }

  // Function to check if the stream is generated by fetching the stream URL
  const checkStreamIsGenerated = () => {
    if (streamingData.StreamingUrl) {
      setIsStreamIsGenerated(false)
      setCountOfCheckIsStreamIsGenerated(0)
      clearInterval(checkStreamIsGeneratedIntervalRef.current as NodeJS.Timeout)
      fetch(STREAM_URL + streamingData.StreamingUrl)
        .then((r) => {
          if (r.status === 200) {
            setIsStreamIsGenerated(true)
            setCountOfCheckIsStreamIsGenerated(0)
          } else {
            throw new Error('Stream not found!')
          }
        })
        .catch((e) => {
          checkStreamIsGeneratedIntervalRef.current = setInterval(() => {
            fetch(STREAM_URL + streamingData.StreamingUrl)
              .then((r) => {
                if (r.status === 200) {
                  setIsStreamIsGenerated(true)
                  setCountOfCheckIsStreamIsGenerated(0)
                  clearInterval(checkStreamIsGeneratedIntervalRef.current as NodeJS.Timeout)
                } else {
                  throw new Error('Stream not found!')
                }
              })
              .catch(() => {
                setCountOfCheckIsStreamIsGenerated((prev) => prev + 1)
              })
          }, 1000)
        })
    }

    return () => {
      if (checkStreamIsGeneratedIntervalRef.current) {
        clearInterval(checkStreamIsGeneratedIntervalRef.current)
      }
    }
  }

  // Fetch the stream URL when the component mounts or the 'currentStreamingType' changes
  useEffect(() => {
    if (filterStateRef.current.SelectedRecordedTime) {
      setIsStreamIsGenerated(false)
      setCountOfCheckIsStreamIsGenerated(0)
      getStreamUrl({
        Stream: currentStreamingType,
        Time: filterStateRef.current.SelectedRecordedTime,
        ChannelNo: deviceId,
      })
    }
  }, [currentStreamingType])
  // }, [deviceId, currentStreamingType, selectedRecordedTime])

  // Retry fetching the stream URL every 5 seconds if it failed previously
  useEffect(() => {
    if (isStreamGetUrlFailed) {
      streamControlIntervalRef.current = setInterval(() => {
        getStreamUrl({
          Stream: currentStreamingType,
          Time: filterStateRef.current.SelectedRecordedTime,
          ChannelNo: deviceId,
        })
      }, 5000)
    }

    return () => {
      if (streamControlIntervalRef.current) {
        clearInterval(streamControlIntervalRef.current)
      }
    }
  }, [isStreamGetUrlFailed])

  // Retry fetching the stream URL every 10 attempts if the stream is not generated
  useEffect(() => {
    if (countOfCheckIsStreamIsGenerated % 10 === 0 && countOfCheckIsStreamIsGenerated !== 0) {
      getStreamUrl({
        Stream: currentStreamingType,
        Time: filterStateRef.current.SelectedRecordedTime,
        ChannelNo: deviceId,
      })
    }
  }, [countOfCheckIsStreamIsGenerated])

  // Effect to manage stream control and checking if the stream is generated
  useEffect(() => {
    if (streamingData.StreamingUrl && !isStreamGetUrlFailed) {
      checkStreamIsGenerated()
      callControlStreaming(streamingData.StreamingId)
      retryStreamGetUrlIntervalRef.current = setInterval(() => {
        callControlStreaming(streamingData.StreamingId)
      }, 10000)
    }

    return () => {
      if (retryStreamGetUrlIntervalRef.current) {
        clearInterval(retryStreamGetUrlIntervalRef.current)
        if (checkStreamIsGeneratedIntervalRef.current) {
          clearInterval(checkStreamIsGeneratedIntervalRef.current)
        }
      }
    }
  }, [streamingData.StreamingUrl])

  // Define the actions for the Form card header
  const headerActionButtons: IActionsButton[] = [
    {
      color: currentStreamingType === 'sub' ? 'cancel' : 'primary',
      text: t`Main`,
      onClick: () => setCurrentStreamingType('main'),
      size: 'small',
    },
    {
      color: currentStreamingType === 'main' ? 'cancel' : 'primary',
      text: t`Sub`,
      onClick: () => setCurrentStreamingType('sub'),
      size: 'small',
    },
  ]

  // if (isLoading) {
  //   return <div className="m-4 mb-0 border rounded-md h-max loading min-h-max aspect-[157/108]" />
  // }

  useEffect(() => {
    if (isLoading) {
      // console.log('loading', isLoading)
    }

    if (getStreamUrlIsLoading) {
      // console.log('getStreamUrlIsLoading', getStreamUrlIsLoading)
    }

    if (isStreamGetUrlFailed) {
      // console.log('isStreamGetUrlFailed', isStreamGetUrlFailed)
    }

    if (isStreamIsGenerated) {
      // console.log('isStreamIsGenerated', isStreamIsGenerated)
    }
  }, [isLoading, getStreamUrlIsLoading, isStreamGetUrlFailed, isStreamIsGenerated])

  return (
    <div className="w-full">
      <FormContainer twoPart={false}>
        <FormCardWithHeader
          icon={name ? channelIcon : undefined}
          header={name || t('Please select record for playback')}
          twoPart={false}
          headerIconButtons={headerIconButtons}
          headerActionButtons={headerActionButtons}
          padding={false}
          middleComponent={
            filterStateRef.current.SelectedRecordedTime ? (
              <RecordedTimeSelector
                // setSelectedHour={setSelectedHour}
                // setSelectedMinute={setSelectedMinute}
                // selectedDateRecordedTimes={selectedDateRecordedTimes}
                selectedRecordedTime={filterStateRef.current.SelectedRecordedTime}
                // setSelectedRecordedTime={setSelectedRecordedTime}
              />
            ) : (
              // <h1 className="text-xl font-semibold text-gray-500">
              //   {t('Please, Select A Time For Playback')}
              // </h1>
              ''
            )
          }
        >
          <LiveBox
            streamUrl={streamingData.StreamingUrl}
            isLoading={
              isLoading || getStreamUrlIsLoading || isStreamGetUrlFailed || !isStreamIsGenerated
            }
          />
        </FormCardWithHeader>
      </FormContainer>
    </div>
  )
}

export default PlaybackViewBox
