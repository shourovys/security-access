import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Hls from 'hls.js'

interface IProps {
  streamUrl: string | null
  isLoading: boolean
}

class PlaybackPlayer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
    this.initPlayer = this.initPlayer.bind(this)
  }

  hls = new Hls({
    debug: true,
    enableWorker: true,
    lowLatencyMode: true,
    // backBufferLength: 90,
    // autoStartLoad: true,
    liveDurationInfinity: true,
    liveSyncDuration: 0,
    liveMaxLatencyDuration: 30,
    // maxLiveSyncPlaybackRate: 1.1,
    // maxBufferLength: 30,
    // maxBufferSize: 200,
    // maxMaxBufferLength: 30,
    // maxBufferHole: 0.5
  })

  videoRef = React.createRef<HTMLVideoElement>()

  initPlayer() {
    // check hls support in built-in video player

    if (Hls.isSupported()) {
      // console.log('HLS.js is supported')
    } else {
      // console.log('HLS.js is not supported')
    }

    if (this.videoRef.current) {
      // console.log('videoRef.current is supported')
    } else {
      // console.log('videoRef.current is not supported')
    }

    if (this.props.streamUrl) {
      // console.log('this.props.streamUrl is supported')
    } else {
      // console.log('this.props.streamUrl is not supported')
    }

    if (Hls.isSupported() && this.videoRef.current && this.props.streamUrl) {
      this.hls.loadSource(this.props.streamUrl)
      this.hls.attachMedia(this.videoRef.current)
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.videoRef.current?.play()
      })

      this.hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        // console.log('LEVEL_LOADED')
        this.seekLive()
      })
    } else if (
      this.videoRef.current &&
      this.videoRef.current.canPlayType('application/vnd.apple.mpegurl') &&
      this.props.streamUrl
    ) {
      // console.log('HLS.js is not supported, but native HLS is supported')
      this.videoRef.current.src = this.props.streamUrl
      this.videoRef.current.onloadedmetadata = () => {
        this.videoRef.current?.play()
      }
    } else {
      // console.log('Video or HLS.js is not supported')
    }
  }

  seekLive() {
    // console.log('seekLive')

    if (this.videoRef.current && this.videoRef?.current?.duration) {
      this.videoRef.current.currentTime = this.videoRef.current.duration - 1

      // if (Math.abs(this.videoRef.current.duration - this.videoRef.current.currentTime) > 10) {
      //   console.log('seekLive')
      //   this.videoRef.current.currentTime = this.videoRef.current.duration - 1
      // }
    }
  }

  componentDidMount() {
    this.initPlayer()
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any) {
    this.initPlayer()
  }

  // componentDidUpdate(prevProps: Readonly<{ streamUrl: string }>, prevState: Readonly<{}>, snapshot?: any) {
  //   if (prevProps.streamUrl !== this.props.streamUrl) {
  //     if (this.hls) {
  //       this.hls.destroy()
  //     }
  //
  //     this.initPlayer()
  //   }
  // }

  componentWillUnmount() {
    // if (this.hls) {
    //   this.hls.destroy()
    // }

    // check video is still playing
    if (this.videoRef.current && !this.videoRef.current.paused) {
      this.videoRef.current.pause()
    }
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
        <video ref={this.videoRef} autoPlay controls className="w-full h-full aspect-[16/9]" />
      </div>
    )
  }
}

export default PlaybackPlayer
