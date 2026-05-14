import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { Role } from "../context/auth.types";

type ProtectedRouteProps = {
    allowedRoles?: Role[];
    children: ReactNode;
};

export default function ProtectedRoute({
    allowedRoles,
    children,
}: ProtectedRouteProps) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.some((role) => user.roles.includes(role))
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
}
