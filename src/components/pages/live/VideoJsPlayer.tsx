import React, { createRef } from 'react'
import videojs from 'video.js'

// Styles
import 'video.js/dist/video-js.css'
import Player from 'video.js/dist/types/player'

interface IProps {
  streamUrl: string
}

export default class VideoJsPlayer extends React.Component<IProps> {
  // constructor(props: IProps) {
  //   super(props)
  // }

  videoNode = createRef<HTMLDivElement>()
  player: Player | null = null

  options = {
    autoplay: 'any',
    controls: true,
    sources: [
      {
        src: this.props.streamUrl,
        type: 'application/x-mpegURL',
      },
    ],
    fluid: true,
    aspectRatio: '16:9',
    responsive: true,
    liveui: true,
    fill: true,
    preload: 'metadata',
    debug: true,
  }

  componentDidMount() {
    const videoElement = document.createElement('video-js')
    videoElement.classList.add('vjs-big-play-centered')

    if (this.videoNode.current) {
      this.videoNode.current.appendChild(videoElement)
      this.player = videojs(videoElement, this.options)

      this.player?.on('ready', () => {
        // console.log('videojs ready')
        // this.player?.play()
      })

      this.player?.on('play', () => {
        // call seek to live point

        // console.log('videojs is playing')

        this.player?.currentTime(this.player?.remainingTime())
      })

      this.player?.on('error', (error: any) => {
        console.log(error)
      })
    }
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any) {
    if (prevProps.streamUrl !== this.props.streamUrl) {
      if (this.player) {
        this.player.src({
          src: this.props.streamUrl,
          type: 'application/x-mpegURL',
        })

        this.player?.play()
      }
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  render() {
    return (
      <div data-vjs-player>
        <div ref={this.videoNode} />
      </div>
    )
  }
}
