import { useMemo } from "react";
import dynamic from "next/dynamic";
import { CSSObjectWithLabel, SingleValue } from "react-select";
import { Option } from "@/_types";
import { ActionType, Asset } from "@/_enums";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface Props {
    instanceId: string,
    title: string,
    selectOptions: Option[],
    inputValue: string,
    selectValue: string,
    inputActionType: ActionType.SET_SOURCE_AMOUNT | ActionType.SET_DESTINATION_AMOUNT,
    selectActionType: ActionType.SET_SOURCE | ActionType.SET_DESTINATION,
    handleInputChange: (type: ActionType.SET_SOURCE_AMOUNT | ActionType.SET_DESTINATION_AMOUNT, value: Asset) => void,
    handleSelectChange: (type: ActionType.SET_SOURCE | ActionType.SET_DESTINATION, value: Asset) => void,
}

const customReactSelectStyles = {
    control: (provided: CSSObjectWithLabel) => ({
        ...provided,
        borderColor: "#d1d5db",
        boxShadow: "none",
        borderRadius: "8px",
        "&:hover": {
            borderColor: "#d1d5db",
        },
    }),
    option: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: "white",
        color: "#374151",
        "&:hover": {
            backgroundColor: "#e5e7eb",
        },
    }),
    menu: (provided: CSSObjectWithLabel) => ({
        ...provided,
        "&:hover": {
            borderColor: "#d1d5db",
        },
        "&:active": {
            "backgroundColor": "white"
        }
    }),
};

export default function InputGroup({
                                       instanceId,
                                       title,
                                       selectOptions,
                                       inputValue,
                                       selectValue,
                                       inputActionType,
                                       selectActionType,
                                       handleInputChange,
                                       handleSelectChange
                                   }: Props) {

    const containerClassName = useMemo(() => {
        const base: string = "grid p-5 rounded-2xl border border-solid border-gray-100";
        const bgColor: string = selectValue ? "bg-white" : "bg-[#F9F9F9]"
        return `${base} ${bgColor}`;
    }, [ selectValue ])

    return (
        <section className={containerClassName}>
            <h4 className="text-base text-gray-500 font-medium">
                {title}
            </h4>

            <div className="my-3 flex items-center flex-col md:flex-row justify-between gap-5">
                <input
                    type="text"
                    className="order-2 md:order-1 w-full h-10 outline-0 py-3 text-2xl lg:text-3xl xl:text-4xl bg-transparent disabled:bg-transparent"
                    pattern="\d*"
                    placeholder="0"
                    disabled={!selectValue}
                    value={inputValue}
                    onChange={(e) => handleInputChange(inputActionType, e.target.value as Asset)}/>

                <Select instanceId={instanceId}
                        options={selectOptions}
                        placeholder="Search tokens"
                        className="order-1 md:order-2 w-full md:w-80"
                        value={selectValue ? selectOptions.find(option => option.value === selectValue) || null : null}
                        styles={customReactSelectStyles}
                        onChange={(newValue) => {
                            const selectedOption = newValue as SingleValue<Option>;
                            handleSelectChange(selectActionType, selectedOption?.value as Asset);
                        }}/>

            </div>
        </section>
    )
}