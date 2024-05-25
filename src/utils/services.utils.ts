import axios, { type AxiosResponse } from "axios";

import { SERVICES_URL } from "./base.utils";
import type { Service } from "@/models/services/services.interface"

export const fetchServices = async (): Promise<Service[]> => {
    try {
        const response: AxiosResponse<Service[]> = await axios.get<Service[]>(SERVICES_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }

}
