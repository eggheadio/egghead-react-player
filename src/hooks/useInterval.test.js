// React hooks have rules so we need to honor them and use this handy library
import {renderHook} from '@testing-library/react-hooks'
import useInterval from './useInterval.js'

// with an async test like setInterval demands, we need Jest's done callback
// this isn't a complete or even useful example beyond getting this to run
test('useInterval', done => {
  // useInterval takes a callback arg and we can use that for testing
  // originally the callback didn't have an argument, but I set it to
  // send `true` so it can be verified.
  const callback = called => {
    // because it's async, Jest throws errors so this traps it and makes it sensible
    try {
      expect(called).toBe(false)
      done()
    } catch (error) {
      done(error)
    }
  }
  const delay = 0
  renderHook(() => useInterval(callback, delay))
})
