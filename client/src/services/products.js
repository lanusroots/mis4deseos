import { apiFetch } from './api'

export const getProducts = (category, search, { sort, sizes } = {}) => {
  const params = new URLSearchParams()
  if (category && category !== 'Todos') params.append('category', category)
  if (search) params.append('search', search)
  if (sort && sort !== 'featured') params.append('sort', sort)
  if (sizes && sizes.length) params.append('size', sizes.join(','))

  const query = params.toString() ? `?${params.toString()}` : ''
  return apiFetch(`/api/products${query}`)
}

export const getProductById = (id) => {
  return apiFetch(`/api/products/${id}`)
}

export const getCategories = () => {
  return apiFetch('/api/products/categories/all')
}

export const createProduct = (data) => {
  return apiFetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateProduct = (id, data) => {
  return apiFetch(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteProduct = (id) => {
  return apiFetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
}