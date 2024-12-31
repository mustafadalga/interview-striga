import { Asset } from "@/_enums";
import { useRates } from "@/_context/rates/RatesProvider";
import { Rate } from "@/_types";

export default function WidgetConversionRate({ source, destination }: { source: Asset, destination: Asset }) {
    const { rates } = useRates();

    if (!rates) return null;

    const ticker: string = `${source}${destination}`;
    const rate: Rate | undefined = rates[ticker];

    if (!rate) return null;


    return (
        <div className="text-sm text-gray-500 font-medium">
            {`1 ${source} = ${rate.sell} ${destination}`}
        </div>
    )
}