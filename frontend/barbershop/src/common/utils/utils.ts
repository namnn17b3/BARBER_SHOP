export function toQueryString(obj: any) {
  let qs = '';
  let first = true;
  for (const key in obj) {
    if (obj[key]) {
      qs += `${first ? '' : '&'}${key}=${encodeURIComponent(obj[key])}`;
      first = false;
    }
  }
  return qs;
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
