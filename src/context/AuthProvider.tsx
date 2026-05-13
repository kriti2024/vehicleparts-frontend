import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

import api from "../api/axios";
import AuthContext from "./auth-context";
import type { User } from "./auth.types";

const STORAGE_KEY = "vehicle_user";
const TOKEN_KEY = "token";
const LOCAL_AUTH_KEY = "axleworks_auth_users";

const readCustomerId = (token: string) => {
    try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload)) as {
            CustomerId?: string;
        };
        const customerId = Number(decoded.CustomerId);
        return Number.isFinite(customerId) ? customerId : undefined;
    } catch {
        return undefined;
    }
};

const loginWithLocalFallback = (
    email: string,
    password: string
) => {
    const saved = localStorage.getItem(LOCAL_AUTH_KEY);
    const localUsers = saved
        ? (JSON.parse(saved) as Array<User & { password: string }>)
        : [];

    const normalizedEmail = email.trim().toLowerCase();
    const fallbackUser = localUsers
        .find((item) =>
            item.email.trim().toLowerCase() === normalizedEmail
            && item.password === password
        );

    if (!fallbackUser) {
        throw new Error(
            "Account not found. Start the backend database or register this customer first."
        );
    }

    const { password: _password, ...user } = fallbackUser;
    void _password;
    return {
        ...user,
        token: user.token || "registered-local-account",
    };
};

export default function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return null;

        try {
            return JSON.parse(saved) as User;
        } catch {
            return null;
        }
    });

    const login = async (
        email: string,
        password: string
    ): Promise<User> => {
        let loggedUser: User;
        const normalizedEmail = email.trim();

        try {
            const res = await api.post("/auth/login", {
                email: normalizedEmail,
                password,
            });

            loggedUser = {
                ...res.data,
                customerId: readCustomerId(res.data.token),
            };
        } catch (error) {
            try {
                loggedUser = loginWithLocalFallback(
                    normalizedEmail,
                    password
                );
            } catch {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(
                        error.response.data?.message
                        ?? "Invalid email or password.",
                        { cause: error }
                    );
                }

                throw new Error(
                    "Invalid email or password.",
                    { cause: error }
                );
            }
        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(loggedUser)
        );

        localStorage.setItem(
            TOKEN_KEY,
            loggedUser.token
        );

        setUser(loggedUser);

        return loggedUser;
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            login,
            logout,
        }),
        [user]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
