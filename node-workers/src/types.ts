import { process, init } from './fetcher.ts'

export type Link = string
export type Links = Array<string>
export type Urls = Array<URL>

export interface Fetcher {
  process: typeof process
  init: typeof init
}
