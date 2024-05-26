import axios, { type AxiosResponse } from "axios";

import { BRANCHES_URL } from "./base.utils";
import type { Branch } from "@/models/branches/branches.interface";

export const fetchBranches = async (): Promise<Branch[]> => {
    try {
        const response: AxiosResponse<Branch[]> = await axios.get<Branch[]>(BRANCHES_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const postBranch = async (branchObject: Branch) => {
    try {
        const response = await axios.post(BRANCHES_URL, branchObject);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const putBranch = async (id: number, branchObject: Branch) => {
    try {
        const response = await axios.put(`${BRANCHES_URL}/${id}`, branchObject);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const removeBranch = async (id: number) => {
    try {
        const response = await axios.delete(`${BRANCHES_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

