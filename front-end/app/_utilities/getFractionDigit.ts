import { Asset } from "@/_enums";
export default function getFractionDigit(currency: Asset): number {
    switch (currency) {
        case Asset.EUR:
            return 2;
        case Asset.USDC:
        case Asset.USDT:
            return 6;
        case Asset.ETH:
        case Asset.BTC:
            return 8;
        default:
            return 2;
    }
}