import { Rates } from "@/_types";

const minimumTradeValueInEUR = 20;

export default function isTradeWithinMinimumEUR(baseCurrency: string, baseAmount: number, rates: Rates): boolean {
    if (baseCurrency === "EUR") {
        return baseAmount >= minimumTradeValueInEUR;
    }

    const ticker = `${baseCurrency}EUR`;
    const rate = rates[ticker]?.price;

    if (!rate) {
        console.error(`Rate for ${ticker} not found. Cannot validate trade.`);
        return false;
    }

    const equivalentValueInEUR = baseAmount * rate;

    return equivalentValueInEUR >= minimumTradeValueInEUR;
}