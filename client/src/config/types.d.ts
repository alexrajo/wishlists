interface SignUpData {
    firstName: string,
    lastName: string,
    username: string,
    email?: string,
    password: string,
    dateOfBirth: string,
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