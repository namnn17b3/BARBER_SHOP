if (!['/authen/login',
      '/authen/register',
      '/authen/forgot-password',
      '/authen/reset-password',
].includes(window.location.pathname)) {
  window.sessionStorage.setItem('prePath', `${window.location.pathname}${window.location.search.toString()}`);
  const expirationDate = new Date('Fri, 31 Dec 9999 23:59:59 GMT');
  document.cookie = `prePath=${`${window.location.pathname}${window.location.search.toString()}` || '/'}; expires=${expirationDate.toUTCString()}; path=/`;
}
