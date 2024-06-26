import axios, { type AxiosResponse } from "axios";

import { SESSION_URL } from "./base.utils";
import type { Session } from "@/models/sessions/session.inteface";

export const fetchSessions = async (): Promise<Session[]> => {
    try {
        const response: AxiosResponse<Session[]> = await axios.get<Session[]>(SESSION_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }

}
export const stopASession = async (id: number): Promise<Session[]> => {
    try {
        const response: AxiosResponse<Session[]> = await axios.put<Session[]>(`${SESSION_URL}/${id}?status=FORCED`);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }

}
