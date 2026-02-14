'use client';

import { updateUserRole } from "@/lib/admin-actions";
import { useTransition } from "react";

interface UserRoleSelectProps {
    userId: string;
    currentRole: string;
    roles: string[];
}

export default function UserRoleSelect({ userId, currentRole, roles }: UserRoleSelectProps) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;
        startTransition(async () => {
            await updateUserRole(userId, newRole as any);
        });
    };

    return (
        <select
            defaultValue={currentRole}
            onChange={handleChange}
            disabled={isPending}
            style={{
                padding: '0.5rem',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: '1px solid var(--card-border)',
                borderRadius: '6px',
                opacity: isPending ? 0.5 : 1,
                cursor: isPending ? 'wait' : 'pointer'
            }}
        >
            {roles.map(role => (
                <option key={role} value={role}>{role}</option>
            ))}
        </select>
    );
}
