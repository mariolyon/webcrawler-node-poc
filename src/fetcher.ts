import { WritableStream } from 'htmlparser2/WritableStream'
import { Readable } from 'node:stream'
import { ReadableStream as WebReadableStream } from 'node:stream/web'
import { mockFetch } from './mocks.ts'

import { type Link, type Links } from './types.ts'

export function init(testMode: boolean) {
  if (testMode) {
    mockFetch()
  }
}

export async function process(baseLink: Link): Promise<Links> {
  const baseUrl = new URL(baseLink)
  return streamPage(baseUrl)
    .then((htmlStream: Readable) =>
      processLinksIn(htmlStream).then((links: Links) => {
        const relevantLinks = links.filter((link: Link) => {
          const url = urlFor(baseUrl, link)
          return url.hostname === baseUrl.hostname
        })
        return relevantLinks
      })
    )
    .catch((err) => {
      throw err
    })
}

function createParser(links: Array<string>): WritableStream {
  return new WritableStream({
    onopentag(name, attribs) {
      if (name == 'a') {
        links.push(attribs.href)
      }
    },
  }) as WritableStream
}

export async function processLinksIn(htmlStream: Readable) {
  let links: Array<string> = []
  const parser = createParser(links)
  return new Promise((resolve, reject) => {
    htmlStream
      .pipe(parser)
      .on('error', (error) => reject(error))
      .on('finish', () => resolve(links))
  })
}

async function streamPage(url: URL) {
  let response

  try {
    response = await fetch(url)
  } catch (err) {
    throw new Error(`error fetching ${url}, ${err}`)
  }

  if (!response.ok) {
    throw new Error(`error fetching ${url}, status: ${response.status}.`)
  } else if (response.body === null) {
    throw new Error(`error fetching ${url}, body is null.`)
  } else {
    let body: ReadableStream<Uint8Array<ArrayBuffer>> = response!.body
    return Readable.fromWeb(body as WebReadableStream)
  }
}

export function urlFor(base: URL, link: string): URL {
  try {
    return new URL(link, base)
  } catch (err) {
    return base
  }
}
