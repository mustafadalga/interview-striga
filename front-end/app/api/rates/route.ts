import { NextResponse } from "next/server";
import handleAxiosError from "@/_utilities/handleAxiosError";
import { connectDB } from "@/_db";
import Rate from "@/_models/Rate";
import { mongoDBDocumentID } from "@/_constants";
import { Rates } from "@/_types";

export async function GET() {
    try {
        await connectDB();

        const rates: Rates | null = await Rate.findById(mongoDBDocumentID);
        if (!rates) {
            return NextResponse.json({ message: "Rates not found" }, { status: 404 });
        }
        return NextResponse.json(rates.data, { status: 200 });

    } catch (error) {
        const formattedError = handleAxiosError(error, "Oops! Something went wrong while loading data sources. Please refresh the page and try again!");
        return NextResponse.json(formattedError, { status:formattedError.status });
    }
}