'use client'

import { useEffect, useState } from 'react';

interface User {
    name: string;
    email: string;
}

export default function AdminProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('/api/auth/me');
            const data = await response.json();

            if (response.ok) {
                setUser(data);
            } else {
                setError(data.error || 'Failed to fetch');
            }

            setLoading(false);
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-600 text-center mt-4">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <p>Name: {user?.name}</p>
                <p>Email: {user?.email}</p>
            </div>
        </div>
    );
}