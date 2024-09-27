/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (mapbox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations,
  );
  displayMap(locations);
}

loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  // VALUES
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});

logoutBtn?.addEventListener('click', logout);

userDataForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  // Appending values into the form data
  const form = new FormData();
  form.append('name', document.getElementById('name').value);
  form.append('email', document.getElementById('email').value);
  form.append('photo', document.getElementById('photo').files[0]);

  updateSettings(form, 'data');
});

userPasswordForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  document.querySelector('.btn--save--password').textContent = 'Updating...';

  const passwordCurrent = document.getElementById('password-current').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;

  await updateSettings(
    { password, passwordConfirm, passwordCurrent },
    'password',
  );

  document.querySelector('.btn--save--password').textContent = 'Save password';

  document.getElementById('password-current').value = '';
  document.getElementById('password').value = '';
  passwordConfirm = document.getElementById('password-confirm').value = '';
});

bookBtn?.addEventListener('click', function (e) {
  e.target.textContent = 'Processing...';
  const { tourId } = e.target.dataset;
  bookTour(tourId);
});
