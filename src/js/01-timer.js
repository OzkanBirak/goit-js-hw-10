// 01-timer.js

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let timerInterval = null;

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const renderTimer = userDate => {
  const nowDate = new Date();
  const date = new Date(userSelectedDate);
  const timeDifference = new Date(date - nowDate);
  if (timeDifference < 0) {
    clearInterval(timerInterval);
    iziToast.error({
      title: 'Error',
      displayMode: 'once',
      message: 'The selected date has already passed.',
      position: 'topRight',
      timeout: 3000,
    });
    document.getElementById('datetime-picker-submit').disabled = true;

    return;
  }
  const milliseconds = timeDifference.getTime();
  const convertMsResult = convertMs(milliseconds);
  for (const key in convertMsResult) {
    document.querySelector(`[data-${key}]`).textContent = String(
      convertMsResult[key]
    ).padStart(2, '0');
  }
};

const options = {
  enableTime: true,

  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates, dateStr, instance) {
    console.log({
      selectedDates,
      dateStr,
      instance,
    });
    userSelectedDate = selectedDates[0];

    if (userSelectedDate < instance.now) {
      document.getElementById('datetime-picker-submit').disabled = true;
      iziToast.warning({
        title: 'Warning',
        displayMode: 'once',
        message: 'Please choose a date in the future.',
        position: 'topRight',
        timeout: 3000,
      });
    } else {
      document.getElementById('datetime-picker-submit').disabled = false;
      renderTimer(userSelectedDate);
    }
  },
};

flatpickr('#datetime-picker', options);

document
  .getElementById('datetime-picker-submit')
  .addEventListener('click', e => {
    e.preventDefault();
    timerInterval = setInterval(() => {
      renderTimer(userSelectedDate);
    }, 1000);
  });
