const BASE_URL = import.meta.env?.VITE_API_URL || ''

const getToken = () => localStorage.getItem('token')

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    // Token vencido/inválido en una ruta protegida → logout global.
    // (No aplica a login/register: ahí un 401 es "credenciales inválidas".)
    const isAuthEndpoint =
      endpoint.includes('/auth/login') || endpoint.includes('/auth/register')

    if (res.status === 401 && !isAuthEndpoint) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }

    throw new Error(data.message || 'Error en la petición')
  }

  return data
}