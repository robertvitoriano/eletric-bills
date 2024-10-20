export function getValidProperties(fields: any) {
  const objectWithValidProperties = {};
  for (const key in fields) {
    if (fields[key]) {
      objectWithValidProperties[key] = fields[key];
    }
  }
  return objectWithValidProperties;
}
export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
