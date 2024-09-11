'use client'

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, status } = useSession();
    const user = session?.user;

    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-gray-800 text-white p-4 shadow-md">
                <nav className="container mx-auto flex justify-between items-center">
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/admin" className="hover:text-gray-400">Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/admin/profile" className="hover:text-gray-400">Profile</Link>
                        </li>
                    </ul>
                    <div className="flex items-center space-x-4">
                        <span>{user?.name}</span>
                        <button
                            onClick={() => signOut()}
                            className="hover:text-gray-400"
                        >
                            Sign out
                        </button>
                    </div>
                </nav>
            </header>
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
                {children}
            </main>
        </div>
    );
}