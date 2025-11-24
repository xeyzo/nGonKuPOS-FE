import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'


console.log('VITE_API_BASE_URL from env:', import.meta.env.VITE_API_BASE_URL);
const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message)
  
    return Promise.reject(error)
  }
)

export default axiosClient