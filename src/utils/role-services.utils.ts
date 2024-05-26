import { ROLE_SERVICES_URL } from "./base.utils";
import type { RoleService } from "@/models/role-services/role-service.interface";
import axios, { type AxiosResponse } from "axios";



export const fetchRoleServices = async (): Promise<RoleService[]> => {
    try {
        const response: AxiosResponse<RoleService[]> = await axios.get<RoleService[]>(ROLE_SERVICES_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const postRoleService = async (RoleServiceObject: RoleService) => {
    try {
        const response = await axios.post(ROLE_SERVICES_URL, RoleServiceObject);
        return response.data;
    } catch (error) {
        console.error("Error fetching RoleServices:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const putRoleService = async (id: number, RoleServiceObject: RoleService) => {
    try {
        const response = await axios.put(`${ROLE_SERVICES_URL}/${id}`, RoleServiceObject);
        return response.data;
    } catch (error) {
        console.error("Error fetching RoleServices:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const removeRoleService = async (id: number) => {
    try {
        const response = await axios.delete(`${ROLE_SERVICES_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching RoleServices:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
