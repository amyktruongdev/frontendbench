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
        const res = await authFetch(`${process.env.REACT_APP_DOMAIN_NAME}/api/admin/users`);
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

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (!window.confirm(`Are you sure you want to change the role to ${newRole}?`)) return;

    try {
      const res = await authFetch(`${process.env.REACT_APP_DOMAIN_NAME}/api/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update role.");
      }

      alert("Role updated successfully!");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong.");
    }
  };

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
            <CardContent className="p-4 flex flex-col gap-2">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Role:</strong> {user.role}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleRoleChange(user.id, "admin")}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
                >
                  Promote to Admin
                </button>

                <button
                  onClick={() => handleRoleChange(user.id, "technician")}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
                >
                  Promote to Technician
                </button>

                <button
                  onClick={() => handleRoleChange(user.id, "user")}
                  className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded"
                >
                  Remove Role
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
