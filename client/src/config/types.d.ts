interface SignUpData {
    firstName: string | undefined,
    lastName: string | undefined,
    username: string | undefined,
    email?: string,
    password: string | undefined,
    dateOfBirth: string | undefined,
}

interface Item {
    itemId: number,
    name: string,
    claimedById?: number,
}

interface Wishlist {
    wishlistId: number,
    title: string,
    description?: string,
    items: Array<Item>,
}

interface User {
    userId: number,
    username: string,
    firstName: string,
    lastName: string,
    email?: string,
}

interface AuthResponse {
    authToken?: string,
    refreshToken?: string,
}