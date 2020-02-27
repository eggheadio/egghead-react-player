import React from 'react'
import omit from 'lodash/omit'
import head from 'lodash/head'

import {propTypes, defaultProps} from './props'
import Bitmovin from './players/Bitmovin'
import YouTube from './players/YouTube'

import useProgressInterval from '../hooks/useProgressInterval'

const PLAYERS_TO_RENDER = [YouTube, Bitmovin]

const ReactPlayer = props => {
  const playerRef = React.useRef(null)
  const {
    style,
    width,
    height,
    dash_url,
    hls_url,
    url,
    onProgress,
    onPlayerInitialized,
  } = props
  const otherProps = omit(props, Object.keys(propTypes))
  const mediaUrl = dash_url || hls_url || url

  useProgressInterval({playerRef, onProgress, url: mediaUrl})

  React.useEffect(() => {
    if (playerRef.current) {
      onPlayerInitialized(playerRef.current)
    }
  }, [playerRef.current])

  const Player = head(PLAYERS_TO_RENDER.filter(p => p.canPlay(mediaUrl)))
  return (
    <div style={{...style, width, height}} {...otherProps}>
      <Player key={Player.displayName} {...props} ref={playerRef} />
    </div>
  )
}

ReactPlayer.propTypes = propTypes
ReactPlayer.defaultProps = defaultProps
ReactPlayer.displayName = 'ReactPlayer'

export default ReactPlayer
