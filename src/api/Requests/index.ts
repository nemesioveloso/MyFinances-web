import { AxiosResponse } from 'axios'
import { axiosInstance } from '..'
import { handleApiError } from './handleApiError'

type RequestParams = {
  url: string
  body?: unknown
}

export const apiService = {
  get: async ({ url }: RequestParams): Promise<AxiosResponse> => {
    try {
      return await axiosInstance.get(url)
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  post: async ({ url, body }: RequestParams): Promise<AxiosResponse> => {
    try {
      return await axiosInstance.post(url, body)
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  put: async ({ url, body }: RequestParams): Promise<AxiosResponse> => {
    try {
      return await axiosInstance.put(url, body)
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  delete: async ({ url }: RequestParams): Promise<AxiosResponse> => {
    try {
      return await axiosInstance.delete(url)
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}
