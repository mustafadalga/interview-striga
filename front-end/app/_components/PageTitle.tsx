import { ReactNode } from "react";

export default function PageTitle({ children }: { children: ReactNode }) {
    return (
        <h1 className="text-gray-600 text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center">
            {children}
        </h1>
    )
}