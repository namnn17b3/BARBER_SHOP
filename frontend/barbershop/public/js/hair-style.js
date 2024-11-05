document.querySelector('#datepicker-format-start')?.setAttribute('datepicker', '');
document.querySelector('#datepicker-format-end')?.setAttribute('datepicker', '');

document.querySelectorAll('.inline-datepicker')?.forEach((el) => {
  el.setAttribute('inline-datepicker', '');
  el.setAttribute('datepicker-buttons', '');
  el.setAttribute('datepicker-autoselect-today', '');
});
