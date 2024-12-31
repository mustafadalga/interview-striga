export const conversionFactors: Record<string, number> = {
    ETH: Math.pow(10, 18), // 1 ETH = 10^18 wei
    BTC: Math.pow(10, 8),  // 1 BTC = 10^8 satoshi
    EUR: 100,              // 1 EUR = 100 cent
    USDT: Math.pow(10, 6), // 1 USDT = 10^6
    USDC: Math.pow(10, 6), // 1 USDC = 10^6
    MATIC: Math.pow(10, 18),
    BNB: Math.pow(10, 18),
};


export default function convertToSmallestUnit(currency: string, amount: number) {
    if (amount < 0) {
        throw new Error('Amount cannot be negative');
    }

    const factor = conversionFactors[currency];

    if (!factor) {
        throw new Error(`Unsupported currency: ${currency}`);
    }
    return Math.round(amount * factor).toString();
}