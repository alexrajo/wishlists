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

interface AuthResponse {
    authToken?: string,
    refreshToken?: string,
}