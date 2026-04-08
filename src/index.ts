import { crawl } from './crawler.ts'

function isValidUrl(s: string) {
  try {
    new URL(s)
    return true
  } catch (err) {
    return false
  }
}

const USAGE = `USAGE: node main url`

if (process.argv.length != 3 || !isValidUrl(process.argv[2])) {
  console.log(USAGE)
  process.exit(1)
} else {
  const url = new URL(process.argv[2])
  crawl(url)
}
