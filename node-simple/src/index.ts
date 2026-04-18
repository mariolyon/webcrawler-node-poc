import Crawler from './crawler.ts'

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
  const crawler = new Crawler()
  crawler.crawl(process.argv[2])
    .then((links) => {
      console.log(links)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
