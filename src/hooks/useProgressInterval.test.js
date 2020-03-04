// React hooks have rules so we need to honor them and use this handy library
import {renderHook, act} from '@testing-library/react-hooks'
import useProgressInterval from './useProgressInterval.js'

const progressCallBackGenerator = (done, valuesToCheck) => progress => {
  try {
    expect(progress).toStrictEqual(valuesToCheck)
    done()
  } catch (error) {
    done(error)
  }
}
describe('useProgressInterval', () => {
  test('should record progress', done => {
    const callback = progressCallBackGenerator(done, {
      loaded: 0.2,
      loadedSeconds: 20,
      played: 0.1,
      playedSeconds: 10,
    })

    const playerRef = {
      current: {
        getDuration: () => 100,
        getFractionPlayed: () => 0.1,
        getFractionLoaded: () => 0.2,
      },
    }
    renderHook(() =>
      useProgressInterval({
        playerRef,
        onProgress: callback,
        url: 'abc123.com',
        intervalTimeMS: 0,
      }),
    )
  })

  test('should not call progress if url is undefined', () => {
    const callback = jest.fn()
    const playerRef = {
      current: {
        getDuration: () => 100,
        getFractionPlayed: () => 0.1,
        getFractionLoaded: () => 0.2,
      },
    }
    renderHook(() =>
      useProgressInterval({
        playerRef,
        onProgress: callback,
        url: undefined,
        intervalTimeMS: 0,
      }),
    )

    expect(callback).not.toHaveBeenCalled()
  })

  test('should not call progress if playerRef.current is undefined', () => {
    const callback = jest.fn()
    const playerRef = {
      current: undefined,
    }
    renderHook(() =>
      useProgressInterval({
        playerRef,
        onProgress: callback,
        url: 'abc123',
        intervalTimeMS: 0,
      }),
    )

    expect(callback).not.toHaveBeenCalled()
  })
})
