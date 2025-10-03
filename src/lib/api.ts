// API Client for Fashion E-Shop Backend
const API_BASE_URL = 'http://localhost:3001/api';

// Token management
export const auth = {
  getToken: () => localStorage.getItem('admin_token'),
  setToken: (token: string) => localStorage.setItem('admin_token', token),
  removeToken: () => localStorage.removeItem('admin_token'),
  isAuthenticated: () => !!auth.getToken(),
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = auth.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Authentication
export const authApi = {
  login: (username: string, password: string) =>
    apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

// Products
export const productsApi = {
  getAll: (params?: { limit?: number; offset?: number; sort?: string; search?: string; status?: string }) =>
    apiRequest<{ products: any[]; pagination: any }>(`/products?${new URLSearchParams(params as any)}`),
  
  getById: (id: number) => apiRequest<any>(`/products/${id}`),
  
  create: (data: any) => apiRequest<{ id: number; message: string }>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: number, data: any) => apiRequest<{ message: string }>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: number) => apiRequest<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),
};

// Upload
export const uploadApi = {
  uploadImages: async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    
    const token = auth.getToken();
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return response.json() as Promise<{ message: string; urls: string[] }>;
  },
};

// Collections
export const collectionsApi = {
  getAll: () => apiRequest<any[]>('/collections'),
  getById: (id: number) => apiRequest<any>(`/collections/${id}`),
  create: (data: any) => apiRequest<{ id: number }>('/collections', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest<{ message: string }>(`/collections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/collections/${id}`, { method: 'DELETE' }),
  addProduct: (id: number, productId: number) => apiRequest<{ message: string }>(`/collections/${id}/products`, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }),
  removeProduct: (id: number, productId: number) => 
    apiRequest<{ message: string }>(`/collections/${id}/products/${productId}`, { method: 'DELETE' }),
};

// Bundles
export const bundlesApi = {
  getAll: () => apiRequest<any[]>('/bundles'),
  getById: (id: number) => apiRequest<any>(`/bundles/${id}`),
  create: (data: any) => apiRequest<{ id: number }>('/bundles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest<{ message: string }>(`/bundles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/bundles/${id}`, { method: 'DELETE' }),
  addField: (id: number, data: any) => apiRequest<{ id: number }>(`/bundles/${id}/fields`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateField: (id: number, fieldId: number, data: any) => 
    apiRequest<{ message: string }>(`/bundles/${id}/fields/${fieldId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteField: (id: number, fieldId: number) =>
    apiRequest<{ message: string }>(`/bundles/${id}/fields/${fieldId}`, { method: 'DELETE' }),
};

// Offers
export const offersApi = {
  getAll: () => apiRequest<any[]>('/offers'),
  getById: (id: number) => apiRequest<any>(`/offers/${id}`),
  create: (data: any) => apiRequest<{ id: number }>('/offers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest<{ message: string }>(`/offers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/offers/${id}`, { method: 'DELETE' }),
};

// Shipping
export const shippingApi = {
  getAll: () => apiRequest<any[]>('/shipping'),
  create: (data: any) => apiRequest<{ id: number }>('/shipping', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest<{ message: string }>(`/shipping/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/shipping/${id}`, { method: 'DELETE' }),
};

// Orders
export const ordersApi = {
  getAll: (params?: { status?: string; limit?: number; offset?: number }) =>
    apiRequest<{ orders: any[]; pagination: any }>(`/orders?${new URLSearchParams(params as any)}`),
  getById: (id: number) => apiRequest<any>(`/orders/${id}`),
  updateStatus: (id: number, status: string) => apiRequest<{ message: string }>(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  exportCSV: () => fetch(`${API_BASE_URL}/orders/export`, {
    headers: { 'Authorization': `Bearer ${auth.getToken()}` },
  }).then(res => res.blob()),
};

// Analytics
export const analyticsApi = {
  getOverview: () => apiRequest<any>('/analytics/overview'),
  getSales: (period: number = 30) => apiRequest<any>(`/analytics/sales?period=${period}`),
  getTraffic: (period: number = 30) => apiRequest<any>(`/analytics/traffic?period=${period}`),
};

// Notifications
export const notificationsApi = {
  getAll: () => apiRequest<any[]>('/notifications'),
  getById: (id: number) => apiRequest<any>(`/notifications/${id}`),
  create: (data: any) => apiRequest<{ id: number }>('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest<{ message: string }>(`/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/notifications/${id}`, { method: 'DELETE' }),
  trigger: (id: number) => apiRequest<{ message: string }>(`/notifications/${id}/trigger`, { method: 'POST' }),
};

// Popups
export const popupsApi = {
  getAll: () => apiRequest<any[]>('/popups'),
  getById: (id: number) => apiRequest<any>(`/popups/${id}`),
  create: (data: any) => apiRequest<{ id: number }>('/popups', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest<{ message: string }>(`/popups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/popups/${id}`, { method: 'DELETE' }),
};

// Settings
export const settingsApi = {
  getAll: () => apiRequest<any[]>('/settings'),
  get: (key: string) => apiRequest<{ value: string }>(`/settings/${key}`),
  update: (key: string, value: string) => apiRequest<{ message: string }>(`/settings/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  }),
  bulkUpdate: (data: Record<string, string>) => apiRequest<{ message: string }>('/settings/bulk/update', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (key: string) => apiRequest<{ message: string }>(`/settings/${key}`, { method: 'DELETE' }),
};