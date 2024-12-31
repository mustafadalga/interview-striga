import { NextRequest, NextResponse } from "next/server";
import handleAxiosError from "@/_utilities/handleAxiosError";
import { env } from "@/_constants";
import getHMAC from "@/_utilities/getHMAC";
import axios from "axios";
import { AccountBalance } from "@/_types";

export async function POST(request: NextRequest) {
    try {
        const body = {
            userId: env.USER_ID,
            ...await request.json()
        }
        const method = "POST";
        const endPoint = "/wallets/get/account";
        const fullURL = `${env.STRIGA_API_BASE_URL}${endPoint}`;

        const headers = {
            accept: 'application/json',
            'api-key': env.API_KEY,
            Authorization: getHMAC(body, method, endPoint),
            'content-type': 'application/json'
        };

        const response = await axios.post(fullURL, body, { headers });
        const { currency, availableBalance } = response.data;

        const accountBalance: AccountBalance = {
            currency,
            amount: parseFloat(response.data.availableBalance.amount),
            hAmount: parseFloat(response.data.availableBalance.hAmount),
            unit: availableBalance.currency,
        };

        return NextResponse.json(accountBalance, { status: 200 });

    } catch (error) {
        const formattedError = handleAxiosError(error, "Oops! Something went wrong loading your account statement. Please refresh the page and try again!");
        return NextResponse.json(formattedError, { status: formattedError.status });
    }
}