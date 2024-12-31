"use client"
import { lazy, useCallback, useMemo, useReducer, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRates } from "@/_context/rates/RatesProvider";
import convertToSmallestUnit from "@/_utilities/convertToSmallestUnit";
import handleAxiosError from "@/_utilities/handleAxiosError";
import isTradeWithinMinimumEUR from "@/_utilities/isTradeWithinMinimumEUR";
import getBalance from "@/_utilities/getBalance";
import getFractionDigit from "@/_utilities/getFractionDigit";
import { ActionType, Asset } from "@/_enums";
import { accountIds, currencyPairs } from "@/_constants";
import { Option, Rates } from "@/_types";
import InputGroup from "@/_components/InputGroup";
import ButtonSwap from "@/_components/ButtonSwap";


const WidgetConversionRate = lazy(() => import("@/_components/WidgetConversionRate"))

interface SwapState {
    source: Asset;
    destination: Asset;
    sourceAmount: string;
    destinationAmount: string;
}

type Action = { type: ActionType.SET_SOURCE; payload: { value: Asset; rates: Rates | null } }
    | { type: ActionType.SET_DESTINATION; payload: { value: Asset; rates: Rates | null } }
    | { type: ActionType.SET_SOURCE_AMOUNT; payload: { value: string; rates: Rates | null } }
    | { type: ActionType.SET_DESTINATION_AMOUNT; payload: { value: string; rates: Rates | null } };

const initialState: SwapState = {
    source: Asset.ETH,
    destination: "" as Asset,
    sourceAmount: "",
    destinationAmount: "",
};

function reducer(state: SwapState, action: Action): SwapState {
    switch (action.type) {
        case ActionType.SET_SOURCE: {
            const { value, rates } = action.payload;
            const selectedCurrency = currencyPairs.find(currency => currency.source === value)!;
            const isValidDestination: boolean = selectedCurrency.targets.some(target => target.target == state.destination);
            const newState = {
                ...state,
                source: value,
                destination: (isValidDestination ? state.destination : "") as Asset,
                destinationAmount:isValidDestination ? state.destinationAmount : ""
            }

            if (!Object.values(newState).every(value => value.length) || !rates) {
                return newState;
            }

            const ticker = `${newState.source}${newState.destination}`;

            if (!rates[ticker]) return newState;


            const sell: number = rates[ticker].sell;
            const rate: string = sell > 0 ? (parseFloat(newState.sourceAmount) * sell).toFixed(getFractionDigit(newState.destination as Asset)) : "";

            return {
                ...newState,
                destinationAmount: rate,
            }
        }
        case ActionType.SET_DESTINATION: {
            const { value, rates } = action.payload;
            const newState = {
                ...state,
                destination: value,
            };

            if (!state.sourceAmount || !rates) {
                return newState;
            }

            const ticker = `${newState.source}${newState.destination}`;

            if (!rates[ticker]) return newState;

            const sell: number = rates[ticker].sell;
            newState.destinationAmount = sell > 0 ? (parseFloat(state.sourceAmount) * sell).toFixed(getFractionDigit(newState.destination as Asset)) : "";

            return newState;
        }
        case ActionType.SET_SOURCE_AMOUNT: {
            const { value, rates } = action.payload;
            const ticker: string = `${state.source}${state.destination}`;
            let rate: string = "";
            if (rates && rates[ticker] && value) {
                const sell: number = rates[ticker].sell;
                rate = sell > 0 ? (parseFloat(value) * sell).toFixed(getFractionDigit(state.destination as Asset)) : ""
            }

            return {
                ...state,
                sourceAmount: value,
                destinationAmount: rate,
            };
        }
        case  ActionType.SET_DESTINATION_AMOUNT: {
            const { value, rates } = action.payload;
            const ticker: string = `${state.source}${state.destination}`;
            let rate: string = "";
            if (rates && rates[ticker] && value) {
                const buy: number = rates[ticker].buy;
                rate = buy > 0 ? (parseFloat(value) / buy).toFixed(getFractionDigit(state.source as Asset)) : ""
            }

            return {
                ...state,
                sourceAmount: rate,
                destinationAmount: value,
            };
        }
        default:
            return state;
    }
}

export default function FormSwap() {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const { rates } = useRates();

    const isPairSelected = useMemo<boolean>(() => !!state.source && !!state.destination, [ state.source, state.destination ]);
    const isReadyToSwap = useMemo<boolean>(() => Object.values(state).every(value => value.length), [ state ]);
    const [ isSwapping, setIsWrapping ] = useState<boolean>(false);
    const sourceOptions = useMemo<Option[]>(() => {
        return currencyPairs.filter(currency => currency.source !== state.destination).map(currency => ({
            value: currency.source,
            label: currency.source,
        }));
    }, [ state.destination ]);

    const destinationOptions = useMemo<Option[]>(() => {
        const selectedSource = currencyPairs.find(currency => currency.source === state.source);
        return selectedSource
            ? selectedSource.targets.map(target => ({
                value: target.target,
                label: target.target,
            }))
            : [];
    }, [ state.source ]);

    const handleInputChange = useCallback((type: ActionType.SET_SOURCE_AMOUNT | ActionType.SET_DESTINATION_AMOUNT, value: string) => {
        if (!/^\d*$/.test(value)) return;

        dispatch({
            type,
            payload: {
                value,
                rates
            },
        });
    }, [ dispatch, rates ]);

    const handleSelectChange = useCallback((type: ActionType.SET_SOURCE | ActionType.SET_DESTINATION, value: Asset) => {
        dispatch({
            type,
            payload: { value, rates },
        });

    }, [ rates ]);

    const handleSwap = useCallback(async () => {
        try {
            if (isSwapping) return;

            setIsWrapping(true);
            const sourceAmount: number = parseFloat(state.sourceAmount)
            const accountBalance = await getBalance(accountIds[state.source as keyof typeof Asset]);

            if (accountBalance && sourceAmount > accountBalance.hAmount) {
                toast.error("Insufficient balance for this swap.", {
                    toastId: "insufficient-balance"
                });
                setIsWrapping(false);

                return;
            }

            const isValid = isTradeWithinMinimumEUR(state.source, sourceAmount, rates as Rates);

            if (!isValid) {
                toast.error(
                    `Base currency value is below the minimum trade value of 20 EUR. Current value: ${sourceAmount.toFixed(2)} EUR`
                    , {
                        toastId: "minimum-trade-value"
                    });
                setIsWrapping(false)
                return;
            }

            const response = await axios.post("/api/swap", {
                sourceAccountId: accountIds[state.source as keyof typeof Asset],
                destinationAccountId: accountIds[state.destination as keyof typeof Asset],
                amount: convertToSmallestUnit(state.source, sourceAmount)
            });

            const { debit, credit, price } = response.data.order;
            setIsWrapping(false);
            toast.success(`Swap Successful! 🎉 You swapped ${debit.amountFloat} ${debit.currency} for ${credit.amountFloat} ${credit.currency} at a rate of 1 ${debit.currency} = ${price} ${credit.currency}.`);

        } catch (error: unknown) {
            const { message } = handleAxiosError(error, "An error occurred. Please try again later.");
            toast.error(message, {
                toastId: "swap"
            })
            setIsWrapping(false);
        }

    }, [ isSwapping, rates, state.destination, state.source, state.sourceAmount ]);

    return (
        <form className="grid gap-3 ">

            <section className="grid gap-3 relative">
                <InputGroup instanceId={"sell"}
                            title={"Sell"}
                            selectOptions={sourceOptions}
                            inputValue={state.sourceAmount}
                            selectValue={state.source}
                            inputActionType={ActionType.SET_SOURCE_AMOUNT}
                            selectActionType={ActionType.SET_SOURCE}
                            handleInputChange={handleInputChange}
                            handleSelectChange={handleSelectChange}/>

                <InputGroup instanceId={"buy"}
                            title={"Buy"}
                            selectOptions={destinationOptions}
                            inputValue={state.destinationAmount}
                            selectValue={state.destination}
                            inputActionType={ActionType.SET_DESTINATION_AMOUNT}
                            selectActionType={ActionType.SET_DESTINATION}
                            handleInputChange={handleInputChange}
                            handleSelectChange={handleSelectChange}/>
            </section>

            <ButtonSwap disabled={!isReadyToSwap}
                        isPending={isSwapping}
                        onClick={handleSwap}/>

            {isPairSelected &&
                <WidgetConversionRate source={state.source as Asset} destination={state.destination as Asset}/>}
        </form>
    )
}