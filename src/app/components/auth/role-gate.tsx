"use client"

import { UserRole } from "@prisma/client";
import { useCurrentRole } from "../../hooks/useCurrentRole";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
};

const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
    const role = useCurrentRole();

    if(role !== allowedRole) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-bold">You don't have permission to access this page.</p>
            </div>
        )
    }
    return (
        <>
        {children}
        </>
    )
}

export default RoleGate;