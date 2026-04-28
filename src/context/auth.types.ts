export type Role =
    | "Admin"
    | "Staff"
    | "Customer";

export interface User {
    userId: string;
    email: string;
    fullName: string;
    roles: Role[];
    token: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (
        email: string,
        password: string
    ) => Promise<User>;
    logout: () => void;
}