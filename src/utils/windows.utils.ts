import axios, { type AxiosResponse } from 'axios'

import { WINDOWS_URL } from './base.utils'
import type { Window } from '@/models/windows/windows.interface'

export const fetchWindows = async (): Promise<Window[]> => {
  try {
    const response: AxiosResponse<Window[]> = await axios.get<Window[]>(WINDOWS_URL)
    return response.data
  } catch (error) {
    console.error('Error fetching Windows:', error)
    throw error // Re-throw the error to handle it elsewhere if needed
  }
}
export const postWindow = async (WindowObject: Window) => {
  try {
    const response = await axios.post(WINDOWS_URL, WindowObject)
    return response.data
  } catch (error) {
    console.error('Error fetching Windows:', error)
    throw error // Re-throw the error to handle it elsewhere if needed
  }
}
export const putWindow = async (id: number, WindowObject: Window) => {
  try {
    const response = await axios.put(`${WINDOWS_URL}/${id}`, WindowObject)
    return response.data
  } catch (error) {
    console.error('Error fetching Windows:', error)
    throw error // Re-throw the error to handle it elsewhere if needed
  }
}
export const removeWindow = async (id: number) => {
  try {
    const response = await axios.delete(`${WINDOWS_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching Windows:', error)
    throw error // Re-throw the error to handle it elsewhere if needed
  }
}
