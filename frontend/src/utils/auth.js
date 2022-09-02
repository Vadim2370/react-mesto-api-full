import { baseUrl } from './constApi';

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject(`Ошибка: ${res.status}`);
}

export function register({ email, password }) {
  return fetch(`${baseUrl}/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}

export function login({ email, password }) {
  return fetch(`${baseUrl}/signin`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}

export function logout() {
  return fetch(`${baseUrl}/signout`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(checkResponse);
}

export function getToken(token) {
  return fetch(`${baseUrl}/users/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
}
