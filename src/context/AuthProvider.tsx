import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import api from "../api/axios";
import AuthContext from "./auth-context";
import type { User } from "./auth.types";

const STORAGE_KEY = "vehicle_user";
const TOKEN_KEY = "token";

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
        const res = await api.post("/auth/login", {
            email,
            password,
        });

        const loggedUser: User = res.data;

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