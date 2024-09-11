"use client"

import { UserRole } from "@prisma/client"
import RoleGate from "../../components/auth/role-gate"
import { useCurrentRole } from "../../hooks/useCurrentRole"
import { useEffect, useState } from 'react'

const AdminPage = () => {
    const [role, setRole] = useState(null)
    
    useEffect(() => {
        const fetchRole = async () => {
            const currentRole = await useCurrentRole()
            setRole(currentRole)
        }
        fetchRole()
    }, [])

    return (
        <><div>
            Current role: {role || 'Loading...'}
        </div><RoleGate allowedRole={UserRole.ADMIN} children={undefined}>


            </RoleGate><div className="">

            </div></>
    )
}

export default AdminPage