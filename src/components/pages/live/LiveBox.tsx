import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { STREAM_URL } from '../../../utils/config'
import HlsPlayer from './HlsPlayer'

// import VideoJsPlayer from './VideoJsPlayer'
// import ReactPlayer from 'react-player/lazy'
interface IProps {
  streamUrl: string | null
  isLoading: boolean
}

// interface IState {
//   steamExist: boolean
// }

class LiveBox extends React.Component<IProps> {
  // state: IState = {
  //   steamExist: false,
  // }

  // intervalIdRef: NodeJS.Timer | null = null
  //
  //
  // checkStream() {
  //   const { streamUrl } = this.props
  //   if (streamUrl) {
  //     this.setState({ steamExist: false })
  //     fetch(STREAM_URL + streamUrl).then((r) => {
  //       if (r.status === 200) {
  //         this.setState({ steamExist: true })
  //         this.setState((prevState: IState) => ({ streamFailedCount: 0 }))
  //       } else {
  //         throw new Error('Stream not found')
  //       }
  //     }).catch((e) => {
  //       const waitForStream = setInterval(() => {
  //         fetch(STREAM_URL + streamUrl).then((r) => {
  //           if (r.status === 200) {
  //             this.setState({ steamExist: true })
  //             clearInterval(waitForStream)
  //             this.setState((prevState: IState) => ({ streamFailedCount: 0 }))
  //           } else {
  //             throw new Error('Stream not found')
  //           }
  //         }).catch(() => {
  //           this.setState((prevState: IState) => ({ streamFailedCount: prevState.streamFailedCount + 1 }))
  //         })
  //       }, 1000)
  //       this.intervalIdRef = waitForStream
  //     })
  //   }
  // }
  //
  // componentDidMount() {
  //   this.checkStream()
  // }
  //
  // componentDidUpdate(prevProps: IProps, prevState: any) {
  //   if (prevProps.streamUrl !== this.props.streamUrl) {
  //     if (this.intervalIdRef) {
  //       clearInterval(this.intervalIdRef)
  //     }
  //     this.checkStream()
  //   }
  //
  //   if (this.state.streamFailedCount % 10 === 0 && this.state.streamFailedCount !== prevState.streamFailedCount) {
  //     this.props.getStreamUrlTrigger()
  //   }
  // }
  //
  // componentWillUnmount() {
  //   if (this.intervalIdRef) {
  //     clearInterval(this.intervalIdRef)
  //   }
  // }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any) {
    // console.log(this.props)
  }

  render() {
    const { isLoading } = this.props
    // const { steamExist } = this.state

    if (isLoading) {
      return (
        <div className="h-max border offline min-h-max aspect-[16/9] bg-[#333333] border-t-0 rounded-b-md  border-[#333333] overflow-hidden">
          {/*// align middle */}
          <div className="flex flex-col justify-center h-full">
            <div className="text-center">
              <p className="text-xl md:text-2xl text-stone-300 font-light">
                <FontAwesomeIcon icon={faCircleNotch} size="xl" spin className="ml-3" /> Waiting for
                stream from device
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="h-max border offline min-h-max aspect-[16/9]  rounded-b-md overflow-hidden border-t-0 border-[#333333] bg-[#333333]">
        {/*<VideoJsPlayer streamUrl={STREAM_URL + this.props.streamUrl} />*/}
        <HlsPlayer streamUrl={STREAM_URL + this.props.streamUrl} />
        {/*<ReactPlayer*/}
        {/*  url={STREAM_URL + this.props.streamUrl}*/}
        {/*  controls={true}*/}
        {/*  live={true}*/}
        {/*/>*/}
      </div>
    )
  }
}

export default LiveBox
