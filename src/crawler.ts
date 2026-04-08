import { spawn, Pool, Worker } from 'threads'

import { type Link, type Links, type Fetcher } from './types.ts'

const testMode = import.meta.env && import.meta.env.MODE === 'test'

let pool = null

export const visited = new Set()

export async function visitUrl(baseUrl: URL): Promise<void> {
  if (visited.has(baseUrl.href)) {
    return Promise.resolve()
  }

  visited.add(baseUrl.href)

  return pool
    .queue((worker: Fetcher) => {
      worker.init(testMode)
      return worker.process(baseUrl.href)
    })
    .then((links: Links) => {
      if (!testMode) {
        console.log({ visited: baseUrl.href, links })
      }

      const promises = links.map((link: Link) =>
        visitUrl(new URL(link, baseUrl))
      )
      return Promise.allSettled(promises).then(() => links)
    })
    .catch((err: Error) => {
      return Promise.reject(err)
    })
}

export async function crawl(url: URL) {
  visited.clear()
  pool = Pool(() => {
    const worker = new Worker('./worker.ts')
    return spawn(worker)
  })

  await visitUrl(url)
  await pool.settled(true)
  await pool.terminate()
}
