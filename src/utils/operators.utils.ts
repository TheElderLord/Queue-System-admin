import axios, { type AxiosResponse } from "axios";

import { OPERATORS_URL } from "./base.utils";
import type { Operator } from "@/models/operators/operator.inteface";

export const fetchOperators = async (): Promise<Operator[]> => {
    try {
        const response: AxiosResponse<Operator[]> = await axios.get<Operator[]>(OPERATORS_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }

}
