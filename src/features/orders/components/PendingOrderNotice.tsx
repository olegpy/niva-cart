'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const REFRESH_INTERVAL_MS = 1500;
const MAX_REFRESHES = 8;

export function PendingOrderNotice() {
  const router = useRouter();
  const [refreshCount, setRefreshCount] = useState(0);
  const gaveUp = refreshCount >= MAX_REFRESHES;

  useEffect(() => {
    if (gaveUp) return;

    const timer = setTimeout(() => {
      router.refresh();
      setRefreshCount((count) => count + 1);
    }, REFRESH_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [gaveUp, refreshCount, router]);

  return (
    <div
      role="status"
      className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm"
    >
      <p className="text-sm text-gray-600">
        {gaveUp
          ? 'Payment received. Your order is still being finalized, reload this page in a minute to see it.'
          : 'Payment received. Finalizing your order…'}
      </p>
    </div>
  );
}
