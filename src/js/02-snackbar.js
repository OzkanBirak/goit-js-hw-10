import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', async event => {
  event.preventDefault(); // Prevent the default form submission behavior
  const delayValue = form.elements['delay'].value;
  const stateValue = form.elements['state'].value;

  try {
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (stateValue === 'fulfilled') {
          resolve({
            message: `✅ Fulfilled promise in ${delayValue}ms`,
            status: 'success',
          });
        } else {
          reject({
            message: `❌ Rejected promise in ${delayValue}ms`,
            status: 'error',
          });
        }
      }, delayValue);
    });

    iziToast[result.status]({
      message: result.message,
      position: 'topRight',
      timeout: 3000,
    });
  } catch (error) {
    iziToast.error({
      message: error.message,
      position: 'topRight',
      timeout: 3000,
    });
  }
});
