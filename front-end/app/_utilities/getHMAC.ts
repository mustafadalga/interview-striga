import crypto from "crypto";
import { env } from "@/_constants";

export default function getHMAC(body: Record<string, string>, method: string, endpoint: string) {
    const hmac = crypto.createHmac('sha256', env.API_SECRET);
    const time = Date.now().toString();
    hmac.update(time);
    hmac.update(method);
    hmac.update(endpoint);

    const contentHash = crypto.createHash('md5');
    contentHash.update(JSON.stringify(body));

    hmac.update(contentHash.digest('hex'));

    const auth = `HMAC ${time}:${hmac.digest('hex')}`;

    return auth;
}