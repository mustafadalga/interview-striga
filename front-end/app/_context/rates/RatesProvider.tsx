"use client";
import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from "react-toastify";
import { Rates } from "@/_types";
import axios from "axios";

interface IFormUtils {
    rates: Rates | null
}

export const RatesContext = createContext<IFormUtils | undefined>(undefined);

async function fetchRates() {
    try {
        const response = await axios.get("/api/rates");
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
        toast.error('Failed to load exchange rates. Please check your internet connection or try again later.', {
            toastId: "rates"
        });
    }
}


export function RatesProvider({
                                  children,
                              }: { children: ReactNode }) {
    const [ rates, setRates ] = useState<Rates | null>(null);
    const milliSeconds: number = 3000;

    const handleFetchRates = useCallback(async () => {
        const rates = await fetchRates();
        if (rates) {
            setRates(rates);
        }
    }, [ setRates ])

    useEffect(() => {
        handleFetchRates();
        setInterval(handleFetchRates, milliSeconds);
    }, []);

    return (
        <RatesContext.Provider value={{ rates }}>
            {children}
        </RatesContext.Provider>
    )
}


export function useRates() {
    const context = useContext(RatesContext);
    if (!context) {
        throw new Error('useRates must be used within a RatesContext');
    }
    return context;
};






