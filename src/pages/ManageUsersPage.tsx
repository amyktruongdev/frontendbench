import { useEffect, useState } from "react";
import { authFetch } from "@/utils/authFetch";
import { Card, CardContent } from "@/components/ui/card";

interface User {
    id: number;
    username: string;
    role: string;
}

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await authFetch(`${process.env.REACT_APP_DOMAIN_NAME}/api/users`);
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Failed to fetch users");
                }
                const data = await res.json();
                setUsers(data);
            } catch (err: any) {
                setError(err.message || "Error fetching users.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-600">Loading users...</p>;
    }

    if (error) {
        return (
            <div className="text-center text-red-600 font-bold">
                🚫 Error loading users: {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
                Manage Users
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((user) => (
                    <Card key={user.id} className="border-gray-300 shadow-md">
                        <CardContent className="p-4 flex flex-col">
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            {/* 
                Later you can add "Change Role" button here
              */}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
