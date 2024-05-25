import { ROLE_URL } from "./base.utils";
import type { RoleModel } from "@/models";
import axios, { type AxiosResponse } from "axios";



export const fetchRoles = async (): Promise<RoleModel[]> => {

    try {
        const response: AxiosResponse<RoleModel[]> = await axios.get<RoleModel[]>(ROLE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
