export const formatQuery = function(query) {
  for (const key in query) {
    if (query[key] === '' || query[key] === null || query[key] === undefined) {
      delete query[key]
    }
  }
  return query
}
