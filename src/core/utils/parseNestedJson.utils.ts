export function parseNestedJson(string: string) {
  try {
    return JSON.parse(string, (_, val) => {
      if (typeof val === 'string')
        return parseNestedJson(val)
      return val
    })
  } catch (exc) {
    return string
  }
}