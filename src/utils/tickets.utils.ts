import axios, { type AxiosResponse } from "axios";

import { TICKETS_URL } from "./base.utils";
import type { Ticket } from "@/models/tickets/tickets.interface";

export const fetchTickets = async (): Promise<Ticket[]> => {
    try {
        const response: AxiosResponse<Ticket[]> = await axios.get<Ticket[]>(TICKETS_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }

}
