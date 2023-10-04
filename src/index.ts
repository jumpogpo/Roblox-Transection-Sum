import dotenv from 'dotenv';
import * as readline from 'readline';
import { purchaseInterface, userDataInterface } from './interface/roblox.interface';
import { getPurchaseData, getUserData } from './lib/roblox.lib';

dotenv.config();
main();

async function main() {
    const robloxCookie: string | undefined = process.env.COOKIE;

    if (!robloxCookie) return console.log("Can't find COOKIE env. Please create a.env file and input COOKIE");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('Please input the month [1-12]: ', async (answer: string) => {
        const month: number = Number(answer)

        if (month && month > 0 && month < 13) {
            const userData: userDataInterface = await getUserData();
            const userId: number = userData["id"];
            console.log(`[Calculating] UserId: ${userId}`);
            const totalRobux: number = Math.abs(await calculateRobux(userId, Number(answer), 0, ""));
            console.log(`[Total]: ${totalRobux}`);
        } else {
            console.log("Please input only number 1-12")
        }

        rl.close();
    });
}

async function calculateRobux(userId: number, month: number, amount: number = 0, cursor: string) : Promise<any> {
    console.log("[Fetch Data] Curosr:", cursor);
    const currentDate: Date = new Date();
    const currentYear: number = currentDate.getFullYear();
    const purchaseResponse = await getPurchaseData(userId, 100, cursor);

    if (purchaseResponse && purchaseResponse.data) {
        const lastPurchaseData: purchaseInterface = purchaseResponse.data[purchaseResponse.data.length - 1];
        const lastPurchaseDate: Date = new Date(lastPurchaseData["created"]);
        const lastPurchaseMonth: number = lastPurchaseDate.getMonth() + 1;

        for (const purchaseData of purchaseResponse.data) {
            const purchaseDate: Date = new Date(purchaseData["created"]);
            const purchaseMonth: number = purchaseDate.getMonth() + 1;
            const purchaseYear: number = purchaseDate.getFullYear();

            if (currentYear > purchaseYear) return amount;
            if (purchaseMonth > month) continue;
            if (purchaseMonth < month) return amount;

            amount += purchaseData["currency"]["amount"];
        }

        if (!purchaseResponse["nextPageCursor"]) return amount;
        if (lastPurchaseMonth >= month) return await calculateRobux(userId, month, amount, purchaseResponse["nextPageCursor"]);
    }
}