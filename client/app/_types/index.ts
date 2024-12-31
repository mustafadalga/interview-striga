import { Asset } from "@/_enums";

export interface CurrencyTarget {
    target: string;
    ticker: string;
}

export interface CurrencyMapping {
    source: string;
    targets: CurrencyTarget[];
}

export type CurrencyMappings = CurrencyMapping[];

export interface Option {
    value: string
    label: string
}

export interface Rate {
    price: number;
    buy: number;
    sell: number;
    timestamp: number;
    hTimestamp: string;
    currency: string;
}

export type Rates = Record<string, Rate>

export interface AccountBalance {
    currency: Asset,
    amount: number,
    hAmount: number,
    unit: string
}