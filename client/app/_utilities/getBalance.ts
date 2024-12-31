import axios from "axios";
import { AccountBalance } from "@/_types";

export default async function getBalance(accountId: string): Promise<AccountBalance | undefined> {
    try {
        const response = await axios.post("/api/get-balance", { accountId });
        if (!response.data.amount) {
            throw new Error('Oops! Something went wrong loading your account statement. Please refresh the page and try again!');
        }

        return response.data

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {

    }
}