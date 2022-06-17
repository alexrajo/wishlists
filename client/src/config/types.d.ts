interface SignUpData {
    firstName: string | undefined,
    lastName: string | undefined,
    username: string | undefined,
    email?: string,
    password: string | undefined,
    dateOfBirth: string | undefined,
}

interface Wishlist {
    wishlistId: number,
    title: string,
    description?: string,
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