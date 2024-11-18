import { WINDOW_SERVICES_URL } from './base.utils'
import type { windowServiceModelDtos } from '@/models/windows/window-service.interface'
import axios, { type AxiosResponse } from 'axios'


export const fetchWindowServices = async (): Promise<windowServiceModelDtos[]> => {
    try {
        const response: AxiosResponse<windowServiceModelDtos[]> = await axios.get<windowServiceModelDtos[]>(WINDOW_SERVICES_URL)
        return response.data
    } catch (error) {
        console.error('Error fetching Windows:', error)
        throw error // Re-throw the error to handle it elsewhere if needed
    }
}
export const postWindowService = async (id: number | undefined | null, WindowServiceObjectArray: windowServiceModelDtos[]) => {
    try {
        console.log(WindowServiceObjectArray)
        const response = await axios.post(`${WINDOW_SERVICES_URL}/window/${id}`, WindowServiceObjectArray)
        return response.data
    } catch (error) {
        console.error('Error fetching WindowServices:', error)
        throw error // Re-throw the error to handle it elsewhere if needed
    }
}
export const putWindowService = async (id: number | undefined | null, WindowServiceObject: windowServiceModelDtos) => {
    try {
        const response = await axios.put(`${WINDOW_SERVICES_URL}/${id}`, WindowServiceObject)
        return response.data
    } catch (error) {
        console.error('Error fetching WindowServices:', error)
        throw error // Re-throw the error to handle it elsewhere if needed
    }
}
export const removeWindowService = async (id: number | undefined | null) => {
    try {
        const response = await axios.delete(`${WINDOW_SERVICES_URL}/${id}`)
        return response.data
    } catch (error) {
        console.error('Error fetching WindowServices:', error)
        throw error // Re-throw the error to handle it elsewhere if needed
    }
}
