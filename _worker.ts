import handler from '../server'

export default {
  fetch: handler.fetch.bind(handler)
}