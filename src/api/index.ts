import axios from 'axios'

// Substitua 'http://sua-url-base.com' pela sua URL base real
const baseURL = 'http://localhost:8080'

export const axiosInstance = axios.create({
  baseURL,
  // Aqui você pode adicionar mais configurações padrões se necessário
  // headers: {'X-Custom-Header': 'foobar'}
})

// Adiciona um interceptor para incluir o token no cabeçalho Authorization
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
