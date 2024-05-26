import axios, { type AxiosResponse } from "axios";

import { SERVICES_URL } from "./base.utils";
import type { Service } from "@/models/services/services.interface"

export const fetchServices = async (): Promise<Service[]> => {
    try {
        const response: AxiosResponse<Service[]> = await axios.get<Service[]>(SERVICES_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching Services:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }

}

export const postService = async (ServiceObject: Service) => {
    try {
        const response = await axios.post(SERVICES_URL, ServiceObject);
        return response.data;
    } catch (error) {
        console.error("Error fetching Services:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const putService = async (id: number, ServiceObject: Service) => {
    try {
        const response = await axios.put(`${SERVICES_URL}/${id}`, ServiceObject);
        return response.data;
    } catch (error) {
        console.error("Error fetching Services:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const removeService = async (id: number) => {
    try {
        const response = await axios.delete(`${SERVICES_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Services:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}


