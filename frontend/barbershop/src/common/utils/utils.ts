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

export function generateTimeSlots() {
  const times = [];
  for (let hour = 8; hour <= 20; hour++) {
    const timeString = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    times.push(timeString);
    if (hour !== 20) {
      const halfHourString = hour < 10 ? `0${hour}:30` : `${hour}:30`;
      times.push(halfHourString);
    }
  }
  return times;
};

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
