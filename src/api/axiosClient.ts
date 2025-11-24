import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'

// Debug: Cek nilai environment variable
console.log('VITE_API_BASE_URL from env:', import.meta.env.VITE_API_BASE_URL);

// 1. Buat Instance Axios
const axiosClient: AxiosInstance = axios.create({
  // Pastikan sudah ada VITE_API_BASE_URL di file .env kamu
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Opsional: batalkan request jika lebih dari 10 detik
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// 2. Response Interceptor (Opsional tapi Recommended)
// Gunanya untuk memproses data sebelum sampai ke component/store
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Jika sukses (status 200-299), langsung kembalikan datanya
    return response
  },
  (error: AxiosError) => {
    // Jika error (status 400, 404, 500), handle di sini
    console.error('API Error:', error.response?.data || error.message)
    
    // Tetap reject agar catch block di component/store bisa jalan
    return Promise.reject(error)
  }
)

export default axiosClient