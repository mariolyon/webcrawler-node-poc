import { crawl, visited } from './crawler'
import { test, expect, beforeAll, afterAll } from 'vitest'

import { mockFetch, restoreFetch } from './mocks'

beforeAll(() => mockFetch())

afterAll(() => restoreFetch())

test('crawl', async () => {
  await crawl(new URL('http://x.abc.com'))
  expect(visited).toEqual(
    new Set([
      'http://x.abc.com/',
      'http://x.abc.com/pages/1',
      'http://x.abc.com/pages/about',
      'http://x.abc.com/pages/2',
      'http://x.abc.com/3',
    ])
  )
})

test('crawl on an erroneous url', async () => {
  await expect(crawl(new URL('http://status500.abc.com'))).rejects.toThrow(
    'error fetching http://status500.abc.com/, status: 500.'
  )

  expect(visited).toEqual(new Set(['http://status500.abc.com/']))
})
