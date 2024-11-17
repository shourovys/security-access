import React from 'react'
import Hls from 'hls.js'

class HlsPlayer extends React.Component<{ streamUrl: string }> {
  constructor(props: { streamUrl: string }) {
    super(props)
    this.initPlayer = this.initPlayer.bind(this)
  }

  hls = new Hls({
    // debug: true,
    enableWorker: true,
    lowLatencyMode: true,
    backBufferLength: 2,
    autoStartLoad: true,
    liveSyncDurationCount: 3,
    liveMaxLatencyDurationCount: 10,
    liveDurationInfinity: true,
    maxBufferLength: 10,
  })

  videoRef = React.createRef<HTMLVideoElement>()

  initPlayer() {
    // check hls support in built-in video player

    if (Hls.isSupported() && this.videoRef.current) {
      this.hls.loadSource(this.props.streamUrl)
      this.hls.attachMedia(this.videoRef.current)
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.videoRef.current?.play()
      })

      this.hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        this.seekLive()
      })
    } else if (
      this.videoRef.current &&
      this.videoRef.current.canPlayType('application/vnd.apple.mpegurl')
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
    // if (this.videoRef.current && this.videoRef?.current?.duration) {
    //
    //   if (Math.abs(this.videoRef.current.duration - this.videoRef.current.currentTime) > 10) {
    //     // console.log('seekLive')
    //     this.videoRef.current.currentTime = this.videoRef.current.duration - 1
    //   }
    // }
  }

  componentDidMount() {
    this.initPlayer()
  }

  componentDidUpdate(
    prevProps: Readonly<{ streamUrl: string }>,
    prevState: Readonly<{}>,
    snapshot?: any
  ) {
    if (prevProps.streamUrl !== this.props.streamUrl) {
      if (this.hls) {
        this.hls.destroy()
      }

      this.initPlayer()
    }
  }

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
    return <video ref={this.videoRef} autoPlay controls className="w-full h-full aspect-[16/9]" />
  }
}

export default HlsPlayer
