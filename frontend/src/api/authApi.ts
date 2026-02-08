import axios, { isAxiosError } from 'axios';
import Cookies from "js-cookie";
import type { GetCurrentUserResponse } from './types';


const API_BASE_URL = 'http://localhost:3000/api/v1';


export const loginUser = async (email : string, password : string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

        const token = response.data.data.jwt;

        console.log("TOKEN:", response.data);

        Cookies.set("auth_token",token, {
            expires: 1, //1 day
            secure: true,
            sameSite: "strict"
        });

        return response.data;
    }catch(error) {
        if(isAxiosError(error)){
            throw error.response?.data?.message || 'Login failed';
        }
        throw 'An unexpected error occurred';
    }
};

export const signupUser = async (email : string, password : string ,firstName : string , lastName : string, phone : string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, { email ,password ,firstName ,lastName ,phone });
        return response.data;
    }catch(error) {
        if(isAxiosError(error)){
            throw error.response?.data?.message || 'Login failed';
        }
        throw 'An unexpected error occurred';
    }
};

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
    const token = Cookies.get("auth_token");

    if (!token) {
    throw new Error("No auth token");
  }

    try {
        const response = await axios.get<GetCurrentUserResponse>(
            `${API_BASE_URL}/user`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;

        } catch (error) {
            if(isAxiosError(error)){
                throw error.response?.data?.message || 'get current user details failed';
            }
            throw 'An unexpected error occurred';
        }

}

