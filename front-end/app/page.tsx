import { ToastContainer } from "react-toastify";
import { RatesProvider } from "@/_context/rates/RatesProvider";
import PageTitle from "@/_components/PageTitle";
import FormSwap from "@/_components/FormSwap";

export default function Home() {

    return (
        <article className="grid gap-8 max-w-xl mx-auto">
            <RatesProvider>
                <PageTitle>
                    Swap Tool
                </PageTitle>
                <FormSwap/>
            </RatesProvider>

            <ToastContainer aria-label="Toast Notifications" position="bottom-right"/>
        </article>
    );
}

