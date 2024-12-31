import { NextRequest, NextResponse } from "next/server";
import handleAxiosError from "@/_utilities/handleAxiosError";
import { env } from "@/_constants";
import getHMAC from "@/_utilities/getHMAC";
import axios from "axios";
import getIpAddress from "@/_utilities/getIpAddress";


export async function POST(request: NextRequest) {
    try {
        const body = {
            userId: env.USER_ID,
            ip: await getIpAddress(),
            ...await request.json()
        }
        const method = "POST";
        const endPoint = "/wallets/swap";
        const fullURL = `${env.STRIGA_API_BASE_URL}${endPoint}`;

        const headers = {
            accept: 'application/json',
            'api-key': env.API_KEY,
            Authorization: getHMAC(body, method, endPoint),
            'content-type': 'application/json'
        };

        const response = await axios.post(fullURL, body, { headers });

        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        const formattedError = handleAxiosError(error, "Oops! Something went wrong while swapping currency. Please refresh the page and try again!");
        return NextResponse.json(formattedError, { status: formattedError.status });
    }
}