function updateDateTimePicker(blockTime) {
  const datepickerElement = document.querySelector('#datepicker-element');
  const options = {
    defaultDatepickerId: null,
    autohide: false,
    format: 'yyyy-mm-dd',
    maxDate: null,
    minDate: null,
    orientation: 'bottom',
    buttons: false,
    autoSelectToday: false,
    title: null,
    rangePicker: false,
    onShow: () => {},
    onHide: () => {},
  };
  const datepicker = new Datepicker(datepickerElement, options);
  datepicker.setDate(blockTime.date);
  datepicker.show();
}

document.addEventListener('apiGetDetailBlockTimeStatus', (event) => {
  if (event?.detail?.status === 'success') {
    updateDateTimePicker(event?.detail?.blockTime);
  }
});
