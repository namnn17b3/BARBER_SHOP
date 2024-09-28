export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function objectMapper(properties: string[], obj: any) {
  const newObj = {};
  for (const property of properties) {
    if (obj[property]) newObj[property] = obj[property];
  }
  if (Object.keys(newObj).length === 0) return null;
  return newObj;
}
