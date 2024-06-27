import axios, { type AxiosResponse } from 'axios'

import { OPERATORS_URL } from './base.utils'
import type { Operator } from '@/models/operators/operator.inteface'

export const fetchOperators = async (): Promise<Operator[]> => {
  try {
    const response: AxiosResponse<Operator[]> = await axios.get<Operator[]>(OPERATORS_URL)
    return response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error // Re-throw the error to handle it elsewhere if needed
  }
}

export const postOperator = async (operatorObject: Operator) => {
  try {
    const response = await axios.post(OPERATORS_URL, operatorObject)
    return response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error // Re-throw the error to handle it elsewhere if needed
  }
}
export const putOperator = async (id: number, operatorObject: Operator) => {
  try {
    const response = await axios.put(`${OPERATORS_URL}/${id}`, operatorObject)
    return response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error // Re-throw the error to handle it elsewhere if needed
  }
}
export const removeOperator = async (id: number) => {
  try {
    const response = await axios.delete(`${OPERATORS_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error // Re-throw the error to handle it elsewhere if needed
  }
}
