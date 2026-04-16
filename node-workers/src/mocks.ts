import { HttpResponse } from 'msw'

const originalFetch = global.fetch

export const fetchMock = async (
  input: string | URL | Request
): Promise<Response> => {
  if (input instanceof URL) {
    const url = input as URL
    switch (input.href) {
      case 'http://x.abc.com/':
        return Promise.resolve(
          HttpResponse.html(`<a href=http://x.abc.com/pages/1>page 1</a>
          some text
           <a href=http://x.abc.com/pages/about>about</a>
           <a href=http://x.abc.com>homepage</a> some test
            <a href=http://u.abc.com>homepage u</a>
            <a href=http://u.x.abc.com>homepage u x</a>
            <a href=http://google.com>google.com</a>
            <a href=ht://yahoo.com>yahoo.com</a>
          `)
        )
      case 'http://x.abc.com/pages/1':
        return Promise.resolve(
          HttpResponse.html(`
            <a href=http://x.abc.com/pages/2>page 2</a>
            some text
            <a href=http://x.abc.com/pages/about>about</a>
            <a href=http://x.abc.com>homepage</a>
            <a href=http://x.abc.com/3>page 3</a>
            `)
        )
      case 'http://x.abc.com/3':
      case 'http://x.abc.com/pages/2':
      case 'http://x.abc.com/pages/about':
        return Promise.resolve(HttpResponse.html(``))
      case 'http://status500.abc.com/':
      case 'http://status500.abc.com':
        return Promise.resolve(HttpResponse.text('Error', { status: 500 }))
      case 'http://error.abc.com':
      case 'http://error.abc.com/':
        return Promise.resolve(HttpResponse.error())
      case 'http://null.abc.com':
      case 'http://null.abc.com/':
        return Promise.resolve(new HttpResponse())
      default:
        return Promise.reject(new Error(`Network Error`))
    }
  }
}

export function restoreFetch() {
  global.fetch = originalFetch
}

export function mockFetch() {
  global.fetch = fetchMock
}
