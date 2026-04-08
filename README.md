# Web Crawler
This web crawler will visit a page, and the links contained in it, which are either relative or have the same hostname. External links are ignored.

The implementation is in NodeJs/TypeScript, and utilizes thread.js to manage a pool of worker threads that each can handle the fetching and parsing of an individual page.
The size of the pool is limited by the number of cores available.

As it it is a prototype, nice to have features typically found in web crawlers have been omitted, including agent declaration, retries and delays between requests have not been implemented.

## How to run
Please use Node v24 as it supports Typescript.

```sh
npm install
node src/index.js SOME_URL #eg SOME_URL https://yahoo.com
```

## How to run tests
```sh
npm run test
```

## How to run tests with coverage
```sh
npm run coverage
```

# Author
Mario Lyon <mario@digileo.com>
