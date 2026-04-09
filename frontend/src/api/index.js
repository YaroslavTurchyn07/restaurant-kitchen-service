import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const dishesAPI = {
  getAll: () => api.get('/dishes'),
  getOne: (id) => api.get(`/dishes/${id}`),
  create: (data) => api.post('/dishes', data),
  update: (id, data) => api.put(`/dishes/${id}`, data),
  remove: (id) => api.delete(`/dishes/${id}`),
};

export const dishTypesAPI = {
  getAll: () => api.get('/dish-types'),
  create: (data) => api.post('/dish-types', data),
  update: (id, data) => api.put(`/dish-types/${id}`, data),
  remove: (id) => api.delete(`/dish-types/${id}`),
};

export const cooksAPI = {
  getAll: () => api.get('/cooks'),
  update: (id, data) => api.put(`/cooks/${id}`, data),
};

export const ingredientsAPI = {
  getAll: () => api.get('/ingredients'),
  create: (data) => api.post('/ingredients', data),
  update: (id, data) => api.put(`/ingredients/${id}`, data),
  remove: (id) => api.delete(`/ingredients/${id}`),
};

export default api;
