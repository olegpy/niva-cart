'use client';

import { useState } from 'react';
import type { SupportChat } from '@/features/support/types';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';
import { AdminChatDetails } from './AdminChatDetail';
import { formatTime } from '@/features/support/lib/formatTime';

type AdminSupportProps = {
  initialChats: SupportChat[];
};

export default function AdminSupport({ initialChats }: AdminSupportProps) {
  const [selectedThreadId, setSelectedThreadId] = useState(initialChats[0]?.id ?? null);
  const chat = initialChats.find((item) => item.id === selectedThreadId) ?? null;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Support Inbox</h1>
          <p className="text-gray-600 mt-2">Customer support conversations</p>
        </div>
        {initialChats.length === 0 && (
          <div className="text-sm text-gray-500">
            No conversations yet
          </div>
        )}

        {initialChats.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Conversations
              </h2>
            </div>

            <div className="divide-y divide-gray-100 max-h-[540px] overflow-y-auto">
              {initialChats.map((item) => {
                const isSelected = item.id === selectedThreadId;
                const lastMessage = item.messages.at(-1);
                const preview = lastMessage?.text ?? 'No messages';

                return (
                  <Button
                    key={item.id}
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedThreadId(item.id)}
                    aria-current={isSelected ? 'true' : undefined}
                    className={cn(
                      'w-full flex-col items-start rounded-none px-4 py-4 text-left text-sm hover:bg-gray-50 focus-visible:ring-inset',
                      isSelected && 'bg-red-50',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <span className="text-xs text-gray-500 shrink-0">
                        {formatTime(item.updatedAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{preview}</p>
                    <p className="mt-1 text-xs text-gray-400">{item.messages.length} messages</p>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col overflow-hidden">
            {!chat && (
              <div className="flex flex-1 items-center justify-center p-8 text-sm text-gray-500">
                Select a conversation to view messages
              </div>
            )}

            {chat && <AdminChatDetails chat={chat} />}
            
          </div>
        </div>}
      </div>
    </div>
  );
}
