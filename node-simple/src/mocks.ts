import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const handlers = [
  http.get('http://x.abc.com/', () => {
    return HttpResponse.html(`<a href=http://x.abc.com/pages/1>page 1</a>
          some text
           <a href=http://x.abc.com/pages/about>about</a>
           <a href=http://x.abc.com>homepage</a> some test
            <a href=http://u.abc.com>homepage u</a>
            <a href=http://u.x.abc.com>homepage u x</a>
            <a href=http://google.com>google.com</a>
            <a href=ht://yahoo.com>yahoo.com</a>
          `)
  }),
  http.get('http://x.abc.com/pages/1', () => {
    return HttpResponse.html(`
            <a href=http://x.abc.com/pages/2>page 2</a>
            some text
            <a href=http://x.abc.com/pages/about>about</a>
            <a href=http://x.abc.com>root page</a>
            <a href=http://x.abc.com/3>page 3</a>
            `)
  }),
  http.get('http://x.abc.com/3', () => HttpResponse.html(``)),
  http.get('http://x.abc.com/pages/2', () => HttpResponse.html(``)),
  http.get('http://x.abc.com/pages/about', () => HttpResponse.html(``)),
  http.get('http://y.abc.com/', () => {
    return HttpResponse.html(`
            <a href=/info>info page</a>
            <a href=about>about page</a>
            <a href=http://y.abc.com>self link</a>
            `)
  }),
  http.get('http://y.abc.com/info', () => {
    return HttpResponse.html(`
            <a href=/>root</a>
            <a href=http://y.abc.com/about>about absolute</a>
            `)
  }),
  http.get('http://y.abc.com/about', () => HttpResponse.html(``)),
  http.get('http://status500.abc.com/', () => {
    return HttpResponse.text('Error', { status: 500 })
  }),
  http.get('http://error.abc.com/', () => {
    return HttpResponse.error()
  }),
  http.get('http://null.abc.com/', () => {
    return new HttpResponse()
  }),
  http.get('*', () => {
    return HttpResponse.error()
  }),
]


export const server = setupServer(...handlers)
