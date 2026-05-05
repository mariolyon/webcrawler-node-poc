import { availableParallelism } from 'node:os'
import { spawn, Pool, Worker, type Pool as PoolType } from 'threads'
import type { Thread } from 'threads'

import { type Link, type Links, type Fetcher } from './types.ts'

const testMode = import.meta.env && import.meta.env.MODE === 'test'

let pool: PoolType<Thread> | null = null
export const visited: Set<string> = new Set()
let waitingFor = 0
let visitCount = 0

export async function visitUrl(baseUrl: URL): Promise<void> {
  visitCount++
  waitingFor++
  visited.add(baseUrl.href)

  return pool!.queue((worker: Fetcher) => {
    worker.init(testMode)
    return worker.process(baseUrl.href)
  }).then((links: Links) => {
    if (!testMode) {
      console.log({ visited: baseUrl.href, links })
    }

    links
      .map((link: Link) => new URL(link, baseUrl))
      .filter((url: URL) => !visited.has(url.href))
      .forEach((url: URL) => visitUrl(url))
  }).catch((err: Error) => {
    console.error(err)
  }).finally(() => void waitingFor--)
}


export async function crawl(url: URL) {
  visited.clear()
  pool = Pool(() => {
    const worker = new Worker('./worker.ts')
    return spawn(worker)
  })
  await visitUrl(url)

  while (waitingFor > 0) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  await pool.settled(true)
  await pool.terminate()
  console.log({ visitCount })
}
