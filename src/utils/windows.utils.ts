import axios, { type AxiosResponse } from "axios";

import { WINDOWS_URL } from "./base.utils";
import type { Window } from "@/models/windows/windows.interface";

export const fetchWindows = async (): Promise<Window[]> => {
    try {
        const response: AxiosResponse<Window[]> = await axios.get<Window[]>(WINDOWS_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }

}
