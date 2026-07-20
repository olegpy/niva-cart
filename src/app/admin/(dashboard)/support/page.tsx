import AdminSupport from '@/features/admin/support/components/AdminSupport';
import { getSupportChatsAction } from '@/features/support/actions/getSupportChats';
import type { SupportChat } from '@/features/support/types';

export const dynamic = 'force-dynamic';

export default async function AdminSupportPage() {
  let chats: SupportChat[] = [];

  try {
    chats = await getSupportChatsAction();
  } catch (error) {
    console.error('Failed to load support chats:', error);
  }

  return <AdminSupport initialChats={chats} />;
}
