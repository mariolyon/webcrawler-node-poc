import Crawler from './crawler'
import { test, expect, beforeAll, afterAll, afterEach } from 'vitest'

import { server } from './mocks'
import type { Links } from './types.ts'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('crawl', async () => {
  const result: Links = await new Crawler().crawl('http://x.abc.com')
  expect(result).toEqual(
    [
      'http://x.abc.com/',
      'http://x.abc.com/pages/1',
      'http://x.abc.com/pages/about',
      'http://x.abc.com/pages/2',
      'http://x.abc.com/3',
    ])
})

test('crawl deduplicates relative and absolute links', async () => {
  const result: Links = await new Crawler().crawl('http://y.abc.com')
  expect(result).toEqual([
    'http://y.abc.com/',
    'http://y.abc.com/info',
    'http://y.abc.com/about',
  ])
})

test('crawl on an erroneous url', async () => {
  const result = await new Crawler().crawl('http://status500.abc.com')
  expect(result).toEqual(['http://status500.abc.com/'])
})
