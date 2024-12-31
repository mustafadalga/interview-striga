const cron = require("node-cron");
const connectDB = require("./db");
const RateModel = require("./models/Rate");
const getHMAC = require("./utilities/getHMAC");
const {  env } = require("./constants");
const transformRates = require("./utilities/transformRates.js");

async function updateRates () {
    try {
        const baseURL = env.STRIGA_API_BASE_URL;
        const endPoint = "/trade/rates"
        const body = {};
        const method = "POST"
        const headers = {
            authorization: getHMAC(body, method, endPoint),
            'api-key': env.API_KEY,
            'Content-Type': 'application/json',
        };

        const url = `${baseURL}${endPoint}`;

        const response = await fetch(url, {
            method,
            headers,
        });
        const responseJson = await response.json();
        const rates = transformRates(responseJson);

        await RateModel.findOneAndUpdate(
            {},
            { data: rates, updatedAt: new Date() },
            { upsert: true, new: true })


    } catch (error) {
        console.error("Error fetching or saving rates:", error);
    }
}

(async () => {
    let consecutiveFailures = 0;
    const maxFailures = 3;

    try {
        await connectDB();
        console.log("MongoDB connected. Starting cron job...");

        // Schedule cron job to run every 30 seconds
        cron.schedule("*/30 * * * * *", async () => {
            try {
                await updateRates();
                consecutiveFailures = 0;
            } catch (error) {
                consecutiveFailures++;
                console.error("Error updating rates in cron job:", error);

                if (consecutiveFailures >= maxFailures) {
                    console.error("Failed 3 times consecutively. Stopping cron job...");
                    process.exit(1);
                }

            }
        });
    } catch (error) {
        console.error("Error initializing application:", error);
        process.exit(1);
    }
})();

