import { test, expect, vi } from 'vitest'
import { init } from './fetcher'

import { restoreFetch } from './mocks'
import * as mocks from './mocks'

test('init in test mode', () => {
  const spy = vi.spyOn(mocks, 'mockFetch')
  init(true)
  expect(spy).toHaveBeenCalled()
  spy.mockRestore()
})

test('init not in test mode', () => {
  restoreFetch()
  const spy = vi.spyOn(mocks, 'mockFetch')
  init(false)
  expect(spy).not.toHaveBeenCalled()
  spy.mockRestore()
})
