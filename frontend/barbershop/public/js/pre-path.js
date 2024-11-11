if (!['/authen/login', '/authen/register', '/authen/forgot-password'].includes(window.location.pathname)) {
  window.sessionStorage.setItem('prePath', window.location.pathname);
}
