export type SignupRequest = {
    email: string;
    password: string;
    userName: string;
};

export type LoginRequest = {
    email: string;
    password :string;
};

export type User = {
    email: string;
    name: string;
}
