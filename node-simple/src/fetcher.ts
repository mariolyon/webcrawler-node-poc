import { WritableStream } from 'htmlparser2/WritableStream'
import { Readable } from 'node:stream'
import { ReadableStream as WebReadableStream } from 'node:stream/web'
import { type Link, type Links } from './types.ts'

export default class Fetcher {
  baseUrl
  constructor(baseLink: Link) {
    this.baseUrl = new URL(baseLink)
  }

  start(): Promise<Links> {
    return streamPage(this.baseUrl)
      .then((htmlStream: Readable) =>
        processLinksIn(htmlStream).then((links: Links) => {
          const relevantLinks = links.filter((link: Link) => {
            const url = urlFor(this.baseUrl, link)
            return url.hostname === this.baseUrl.hostname
          })
          return [...new Set(relevantLinks)]
        })
      )
  }
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

export async function processLinksIn(htmlStream: Readable): Promise<Links> {
  let links: Links = []
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
