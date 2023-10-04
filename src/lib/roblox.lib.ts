import axios from 'axios';
import { purchaseResponse, userDataInterface } from '../interface/roblox.interface';

const getXCSRF = async () : Promise<string> => {
    const response: any = await axios.post("https://auth.roblox.com/v1/login", {
        "Cookie": `.ROBLOSECURITY=${process.env.COOKIE}`,
        "User-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36 Edg/106.0.1370.47"
    }).then(response => response).catch(error => error.response);

    return response.headers['x-csrf-token'];
}

const getPurchaseData = async (userId: number, limit: number = 100, cursor: string) : Promise<any> => {
    const XSRF: string = await getXCSRF();

    if (XSRF) {
        const response: purchaseResponse = await axios({
            method: "get",
            url: `https://economy.roblox.com/v2/users/${userId}/transactions?cursor=${cursor}&limit=${limit}&transactionType=Purchase`,
            headers: {
                "Cookie": `.ROBLOSECURITY=${process.env.COOKIE}`,
                "User-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36 Edg/106.0.1370.47",
                "X-CSRF-TOKEN": XSRF
            }
        }).then(response => response).catch(error => error.response);

        return response.data;
    } else {
        return null;
    }
}

const getUserData = async() : Promise<userDataInterface> => {
    const response: any = await axios({
        method: "get",
        url: `https://users.roblox.com/v1/users/authenticated`,
        headers: {
            "Cookie": `.ROBLOSECURITY=${process.env.COOKIE}`,
            "User-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36 Edg/106.0.1370.47",
        }
    }).then(response => response).catch(error => error.response);

    return response.data;
}

export { getPurchaseData, getUserData };