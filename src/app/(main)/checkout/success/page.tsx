import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/admin/auth/lib/auth';
import { CheckoutOutcome } from '@/features/orders/components/CheckoutOutcome';
import { firstParam } from '@/shared/lib/firstParam';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ session_id?: string | string[] }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/admin/login');
  }

  const sessionId = firstParam((await searchParams).session_id);

  return (
    <div className="mx-auto max-w-2xl">
      {sessionId ? (
        <CheckoutOutcome sessionId={sessionId} userId={session.user.id} />
      ) : (
        <p className="text-sm text-gray-600">
          Missing session reference. Please return to your cart.
        </p>
      )}
    </div>
  );
}
