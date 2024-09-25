import axios from "axios";

const API_BASE = "http://localhost:8080/";
const URL = `${API_BASE}auth`;

export class AuthService {
    async login(data) {
        try {
            const request = await axios.post(`${URL}/login-admin`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = request.data;

            return response;
        } catch (error) {
            console.error("Error making API request:", error);
            throw error;
        }
    }
}
