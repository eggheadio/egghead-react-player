import React from 'react'
import useInterval from './useInterval'

const progress = ({prevLoadedRef, prevPlayedRef, player, onProgress}) => {
  const prevLoaded = prevLoadedRef.current
  const prevPlayed = prevPlayedRef.current
  const {loaded, played} = calculateProgress({
    prevLoaded,
    prevPlayed,
    player,
    onProgress,
  })
  prevLoadedRef.current = loaded
  prevPlayedRef.current = played
}

const calculateProgress = ({player, onProgress, prevLoaded, prevPlayed}) => {
  const loaded = player.getFractionLoaded() || 0
  const played = player.getFractionPlayed() || 0
  const duration = player.getDuration()
  const progress = {}

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
  return {loaded, played}
}

const useProgressInterval = ({
  playerRef,
  onProgress,
  url,
  intervalTimeMS = 100,
}) => {
  const prevLoadedRef = React.useRef(null)
  const prevPlayedRef = React.useRef(null)
  useInterval(() => {
    if (url && playerRef.current) {
      progress({
        onProgress,
        player: playerRef.current,
        prevLoadedRef,
        prevPlayedRef,
      })
    }
  }, intervalTimeMS)
}

export default useProgressInterval
