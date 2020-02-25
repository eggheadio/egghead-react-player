import React from 'react'
import omit from 'lodash/omit'
import head from 'lodash/head'

import {propTypes, defaultProps} from './props'
import Bitmovin from './players/Bitmovin'
import YouTube from './players/YouTube'

const PLAYERS_TO_RENDER = [YouTube, Bitmovin]

function useInterval(callback, delay) {
  const savedCallback = React.useRef()

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

const progress = ({url, player, onProgress, prevLoadedRef, prevPlayedRef}) => {
  if (url && player) {
    const loaded = player.getFractionLoaded() || 0
    const played = player.getFractionPlayed() || 0
    const duration = player.getDuration()
    const progress = {}
    const prevLoaded = prevLoadedRef.current
    const prevPlayed = prevPlayedRef.current
    if (loaded !== prevLoaded) {
      progress.loaded = loaded
      if (duration) {
        progress.loadedSeconds = progress.loaded * duration
      }
    }
    if (played !== prevPlayed) {
      progress.played = played
      if (duration) {
        progress.playedSeconds = progress.played * duration
      }
    }
    if (progress.loaded || progress.played) {
      onProgress(progress)
    }
    prevLoadedRef.current = loaded
    prevPlayedRef.current = played
  }
}

const useProgressInterval = ({
  playerRef,
  onProgress,
  url,
  intervalTimeMS = 100,
}) => {
  const prevLoadedRef = React.useRef(null)
  const prevPlayedRef = React.useRef(null)

  useInterval(
    () =>
      progress({
        onProgress,
        url,
        player: playerRef.current,
        prevLoadedRef,
        prevPlayedRef,
      }),
    intervalTimeMS,
  )
}

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
