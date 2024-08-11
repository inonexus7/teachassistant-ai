import axios from "axios"

// export const serverUrl: string = "https://6117-3-19-19-208.ngrok-free.app"
export const serverUrl: string = "http://localhost:5000"
export const axiosApi = axios.create({
    baseURL: serverUrl,
    headers: {
        "Content-Type": "application/json"
    }
})