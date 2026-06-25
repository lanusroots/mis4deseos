import { apiFetch } from './api'

export const login = (email, password) => {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export const register = (name, email, password) => {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role: 'user' }),
  })
}

export const getProfile = () => {
  return apiFetch('/api/auth/profile')
}

export const updateProfile = (data) => {
  return apiFetch('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}