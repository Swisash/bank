import axios, { isAxiosError } from 'axios';
import Cookies from "js-cookie";
const API_BASE_URL = 'http://localhost:3000/api/v1';

export const transferMoney = async  ( toEmail: string, amount : number, transferDescription : string ) => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No token found");
    try{
        console.log("TOKEN FROM COOKIE:", token);
        console.log("🚀 Sending request to API...");
        console.log(toEmail);
        console.log(amount);
        console.log(transferDescription);

        const response = await axios.post(
            `http://localhost:3000/api/v1/transactions`, 
            { toEmail, amount, transferDescription },
                {
                headers:{
                    Authorization: `Bearer ${token}`,
                    withCredentials: true
                    },
                }
        );
        console.log("server response:",response.data);
        return response.data;

    } catch(error :any) {
        console.error("Data:", error.response.data);
        console.error("Status:", error.response.status);
        
        if(isAxiosError(error)){
            throw new Error(error.response?.data?.message || 'transferMoney failed');
        }
        throw new Error('An unexpected error occurred in transfer money');
    }
};