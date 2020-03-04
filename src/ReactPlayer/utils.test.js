import {parseStartTime} from './utils'

test('parseStartTime', () => {
  const url = 'https://youtube.com/video?t=1h14m30s'
  const timeInSeconds = parseStartTime(url)

  expect(timeInSeconds).toEqual(4470)
})
