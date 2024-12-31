import axios from "axios";
import { errorsByCode } from "@/_constants";

interface AxiosError {
    status: number,
    errorCode?: string;
    message: string;
}

export default function handleAxiosError(error: unknown, defaultMessage: string): AxiosError {
    console.log(error)
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const { data: { errorCode }, status } = error.response;

            return {
                status,
                message: errorsByCode[errorCode] || defaultMessage,
                errorCode
            }
        }

        return {
            status: 500, // Internal Server Error
            message: defaultMessage,
        };
    }


    return {
        status: 520, // Unknown Error
        message: defaultMessage,
        errorCode: "",
    };
}
