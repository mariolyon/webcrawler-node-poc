import { test, expect, beforeAll, afterAll } from 'vitest'
import { process, processLinksIn, urlFor } from './fetcher'
import { Readable } from 'node:stream'
import { mockFetch, restoreFetch } from './mocks'

beforeAll(() => mockFetch())

afterAll(() => restoreFetch())

let html = `<a href=google.com>Google</a> abc
   <a href=mail.google.com/mail/1>Mail</a> abc
   <a href=ext.mail.google.com/mail/ext/2>Google</a> abc
   <a href=yahoo.com/abc/def>Yahoo</a>`

test('extract links', async () => {
  let stream = Readable.from(html)
  let result = await processLinksIn(stream)
  expect(result).toEqual([
    'google.com',
    'mail.google.com/mail/1',
    'ext.mail.google.com/mail/ext/2',
    'yahoo.com/abc/def',
  ])
})

test('process', async () => {
  let result = await process('http://x.abc.com')
  expect(result).toEqual([
    'http://x.abc.com/pages/1',
    'http://x.abc.com/pages/about',
    'http://x.abc.com',
  ])
})

test('process a url that fails to be fetched', async () => {
  await expect(process('http://x.yahoo.com')).rejects.toThrow(
    'error fetching http://x.yahoo.com/, Error: Network Error'
  )
})

test('process a url that returns an error status', async () => {
  await expect(process('http://status500.abc.com')).rejects.toThrow(
    'error fetching http://status500.abc.com/, status: 500.'
  )
})

test('process a url that returns an error status', async () => {
  await expect(process('http://error.abc.com')).rejects.toThrow(
    'error fetching http://error.abc.com/, status: 0.'
  )
})

test('process a url that returns an null body', async () => {
  await expect(process('http://null.abc.com')).rejects.toThrow(
    'error fetching http://null.abc.com/, body is null.'
  )
})

test('urlFor', () => {
  expect(urlFor(new URL('http://google.com'), 'about.html')).toEqual(
    new URL('http://google.com/about.html')
  )

  expect(
    urlFor(new URL('http://google.com'), 'http://yahoo.com/about.html')
  ).toEqual(new URL('http://yahoo.com/about.html'))

  expect(
    urlFor(new URL('http://google.com'), 'http://yahoo .com/about.html')
  ).toEqual(new URL('http://google.com'))
})
