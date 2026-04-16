import { expose } from 'threads/worker'
import { process, init } from './fetcher.ts'

expose({ process, init })
