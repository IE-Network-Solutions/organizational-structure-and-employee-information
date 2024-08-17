export function parseNestedJson(string: string) {
  try {
    return JSON.parse(string, (key, val) => {
      if (typeof val === 'string') return parseNestedJson(val);
      return val;
    });
  } catch (exception) {
    return string;
  }
}
