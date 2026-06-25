import { apiFetch } from './api'

export const sendContact = (data) => {
  return apiFetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}