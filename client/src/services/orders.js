import { apiFetch } from './api'

export const createOrder = (data) => {
  return apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const getMyOrders = () => {
  return apiFetch('/api/orders/my-orders')
}

export const getAllOrders = () => {
  return apiFetch('/api/orders')
}

export const updateOrderStatus = (id, status) => {
  return apiFetch(`/api/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}