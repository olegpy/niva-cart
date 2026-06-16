import UsersList from '@/components/admin/UsersList';
import { getUsers } from '@/api/users';
import type { User } from '@/types/user';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  let users: User[] | null = null;

  try {
    users = await getUsers();
  } catch (error) {
    console.error('Failed to load users:', error);
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Registered users in the database</p>
        </div>

        {users === null ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Unable to load users. Please try again later.
          </div>
        ) : (
          <UsersList users={users} />
        )}
      </div>
    </div>
  );
}
