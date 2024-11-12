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

export function getCookie(key: string) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(key + '=') === 0) {
      return cookie.substring(key.length + 1);
    }
  }
  return null;
}

export function setCookie(key: string, value: string, millisecondsToExpire = null) {
  if (millisecondsToExpire) { 
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + millisecondsToExpire);
    const expires = `expires=${expirationDate.toUTCString()}`;
    document.cookie = `${key}=${value}; ${expires}; path=/`;
  } else {
    const expirationDate = new Date('Fri, 31 Dec 9999 23:59:59 GMT');
    document.cookie = `${key}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  }
}

export function deleteCookie(key: string) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
