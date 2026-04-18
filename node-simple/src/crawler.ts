import { type Link, type Links } from './types.ts'
import Fetcher from './fetcher.ts'

const testMode = import.meta.env && import.meta.env.MODE === 'test'

const MAX_JOBS = 10

export default class Crawler {
  jobsInProgress: number = 0
  jobs: Array<Promise<void>> = []
  queue: string[] = []
  seen: Set<Link> = new Set()

  private processQueue() {
    while (this.jobsInProgress < MAX_JOBS && this.queue.length > 0) {
      this.jobsInProgress++
      const link: string = this.queue.shift()!
      const job = this.visitUrl(link).catch((err: Error) => {
        console.error({ error: err })
      })
      this.jobs.push(job)
    }
  }

  private async visitUrl(baseUrl: Link): Promise<void> {
    const fetcher = new Fetcher(baseUrl)
    return fetcher
      .start()
      .then((links) => {
        if (!testMode) {
          console.log({ visited: baseUrl, links })
        }
        const unseenLinks = links
          .map((link) => new URL(link, baseUrl).href)
          .filter((link) => !this.seen.has(link))
        unseenLinks.forEach((link) => {
          this.seen.add(link)
          this.queue.push(link)
        })

        return Promise.resolve()
      })
      .finally(() => {
        this.jobsInProgress--
        this.processQueue()
      })
  }


  async crawl(link: Link): Promise<Links> {
    const normalizedLink = new URL(link).href
    this.seen.add(normalizedLink)
    this.queue.push(normalizedLink)
    this.processQueue()
    while (this.queue.length > 0 || this.jobsInProgress > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await Promise.allSettled(this.jobs)
    }
    return [...this.seen];
  }
}
