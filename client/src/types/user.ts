export type User = {
    id: string;
    displayName: string;
    email: string;
    token: string;
    imageUrl?: string;
    roles: string[];
}

export type LoginCreds = {
    email: string;
    password: string;
}

export type RegisterCreds = {
    displayName: string;
    email: string;
    password: string;
    gender: string;
    dateOfBirth: Date;
    city: string;
    country: string;
}