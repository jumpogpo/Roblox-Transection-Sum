interface purchaseResponse {
    data: purchaseInterface[];
    nextPageCursor: string;
    previousPageCursor: string;
}

interface purchaseInterface {
    id: number;
    idHash: string;
    transactionType: string;
    created: string;
    isPending: boolean;
    agent: {
        id: number;
        type: string;
        name: string;
    };

    details: {
        id: number;
        name: string;
        type: string;
        place: {
            placeId: number;
            universeId: number;
            name: string;
        }
    };

    currency: {
        amount: number;
        type: string;
    }

    purchaseToken: any;
}

interface userDataInterface {
    id: number;
    name: string;
    displayName: string;
}

export { purchaseResponse, purchaseInterface, userDataInterface }