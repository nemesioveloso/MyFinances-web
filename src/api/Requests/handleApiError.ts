import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    if (
      axiosError.response &&
      axiosError.response.data &&
      typeof axiosError.response.data === 'object' &&
      'detail' in axiosError.response.data
    ) {
      const message = axiosError.response.data.detail
      if (typeof message === 'string') {
        toast.warning(message)
      } else {
        toast.warning('Ocorreu um erro na resposta da API')
      }
    }
  }
}
