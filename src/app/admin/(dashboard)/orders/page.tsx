import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/admin/auth/lib/auth';
import {
  listAllOrders,
  listOrdersForUser,
} from '@/features/orders/api/orders';
import { AdminOrdersTable } from '@/features/admin/orders/components/AdminOrdersTable';
import { getUsers } from '@/features/admin/users/api/users';
import { Button } from '@/shared/components/ui/button';
import { firstParam } from '@/shared/lib/firstParam';
import type { Order } from '@/features/orders/types';
import type { User } from '@/features/admin/users/types';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ userId?: string | string[] }>;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') {
    redirect('/admin/login');
  }

  const resolved = await searchParams;
  const userId = firstParam(resolved.userId);

  let orders: Order[] | null = null;
  let users: User[] = [];
  try {
    [orders, users] = await Promise.all([
      userId ? listOrdersForUser(userId) : listAllOrders(),
      getUsers(),
    ]);
  } catch (error) {
    console.error('Failed to load orders:', error);
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">
            Stripe checkout orders across all customers
          </p>
        </div>

        <form
          method="get"
          className="mb-4 flex flex-wrap items-end gap-3 bg-white rounded-lg shadow p-4"
        >
          <label className="flex flex-col text-sm text-gray-700">
            <span className="mb-1 font-medium">Filter by user</span>
            <select
              name="userId"
              defaultValue={userId ?? ''}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email} ({user.role})
                </option>
              ))}
            </select>
          </label>
          <Button type="submit">Filter</Button>
          {userId ? (
            <Link
              href="/admin/orders"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear filter
            </Link>
          ) : null}
        </form>

        {orders === null ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Unable to load orders. Please try again later.
          </div>
        ) : (
          <AdminOrdersTable orders={orders} />
        )}
      </div>
    </div>
  );
}
