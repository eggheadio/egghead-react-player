import useInterval from './useInterval'

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

export default useProgressInterval
