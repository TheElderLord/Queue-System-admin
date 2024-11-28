import axios, { type AxiosResponse } from 'axios';
import { TIMEOUT_URL } from './base.utils';
import type { TicketStatusTimeOut } from '@/models/tickets/ticketsStatusTimeOut.interface';

export const fetchTicketStatus = async (): Promise<TicketStatusTimeOut[]> => {
  try {
    const response: AxiosResponse<TicketStatusTimeOut[]> = await axios.get<TicketStatusTimeOut[]>(TIMEOUT_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket status timeouts:', error);
    throw error;
  }
};

export const postTicketStatus = async (ticketStatus: TicketStatusTimeOut): Promise<TicketStatusTimeOut> => {
  try {
    const response: AxiosResponse<TicketStatusTimeOut> = await axios.post<TicketStatusTimeOut>(TIMEOUT_URL, ticketStatus);
    return response.data;
  } catch (error) {
    console.error('Error posting ticket status timeout:', error);
    throw error;
  }
};

export const putTicketStatus = async (id: number, ticketStatus: TicketStatusTimeOut): Promise<TicketStatusTimeOut> => {
  try {
    const response: AxiosResponse<TicketStatusTimeOut> = await axios.put<TicketStatusTimeOut>(`${TIMEOUT_URL}/${id}`, ticketStatus);
    return response.data;
  } catch (error) {
    console.error('Error updating ticket status timeout:', error);
    throw error;
  }
};

export const removeTicketStatus = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${TIMEOUT_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting ticket status timeout:', error);
    throw error;
  }
};
