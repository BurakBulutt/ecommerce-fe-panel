import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = "http://localhost:8080/";
const URL = `${API_BASE}users`;

export class UserService {
    async getAll({pageNum,pageSize = 13}) {
        try {
            const req = await axios.get(`${URL}?page=${pageNum}&size=${pageSize}`,{
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : Cookies.get("token")
                }
            });
            const response = req.data;
            return response;
        }catch (error){
            console.error("Error the Fetching Data : ",error)
            throw error;
        }
    }
    async save(request) {
        try {
            const req = await axios.post(`${URL}`,request,{
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : Cookies.get("token")
                }
            });
            const response = req.data;
            return response;
        }catch (error){
            console.error("Error the Fetching Data : ",error)
            throw error;
        }
    }
    async update(request) {
        try {
            const req = await axios.put(`${URL}/${request.id}`,request,{
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : Cookies.get("token")
                }
            });
            const response = req.data;
            return response;
        }catch (error){
            console.error("Error the Fetching Data : ",error)
            throw error;
        }
    }
    async delete(id) {
        try {
            const req = await axios.delete(`${URL}/${id}`,{
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : Cookies.get("token")
                }
            });
            const response = req.data;
            return response;
        }catch (error){
            console.error("Error the Fetching Data : ",error)
            throw error;
        }
    }
}