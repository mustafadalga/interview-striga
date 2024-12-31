import axios from "axios";

let cachedIpAddress = "";

export default async function getIpAddress(): Promise<string> {
    if (!cachedIpAddress) {
        cachedIpAddress = await fetchIpAddress();
    }
    return cachedIpAddress;
}

async function fetchIpAddress(): Promise<string> {
    try {
        const { data } = await axios.get("https://api.ipify.org?format=json");
        return data.ip;
    } catch (error) {
        console.error("Failed to fetch IP address:", error);
        return "";
    }
}
