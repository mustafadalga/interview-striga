import Loader from "@/_components/Loader";

interface Props {
    disabled: boolean,
    isPending: boolean
    onClick: () => void
}

export default function ButtonSwap({ disabled, isPending, onClick }: Props) {
    return (
        <button type="button"
                disabled={disabled}
                onClick={onClick}
                className="grid place-items-center h-14 p-4 bg-fuchsia-50 hover:bg-fuchsia-100 disabled:bg-gray-100 disabled:text-gray-400 rounded-[20px] text-lg text-fuchsia-400 font-bold transition-colors duration-300">
            {isPending ? <Loader/> : "Swap"}
        </button>
    )
}