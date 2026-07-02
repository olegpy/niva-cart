'use client';

import { useState } from 'react';
import { MOCK_SUPPORT_THREADS } from '@/features/admin/support/components/mockSupportData';
import type { ChatMessage } from '@/features/support/types';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminSupport() {
  const [selectedThreadId, setSelectedThreadId] = useState(MOCK_SUPPORT_THREADS[0]?.id ?? null);
  const thread = MOCK_SUPPORT_THREADS.find((item) => item.id === selectedThreadId) ?? null;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Support Inbox</h1>
          <p className="text-gray-600 mt-2">View customer questions (demo data)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Conversations
              </h2>
            </div>

            <div className="divide-y divide-gray-100 max-h-[540px] overflow-y-auto">
              {MOCK_SUPPORT_THREADS.map((item) => {
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
            {!thread && (
              <div className="flex flex-1 items-center justify-center p-8 text-sm text-gray-500">
                Select a conversation to view messages
              </div>
            )}

            {thread && (
              <>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">{thread.name}</h2>
                  <p className="text-sm text-gray-500">Customer support thread</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[480px]">
                  {thread.messages.map((message: ChatMessage) => {
                    const isAdmin = message.authorRole === 'admin';

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            isAdmin
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className={`flex items-center gap-2 text-xs mb-1 ${
                            isAdmin ? 'text-red-100' : 'text-gray-500'
                          }`}>
                            <span className="font-medium">{message.authorName}</span>
                            <span>{isAdmin ? '(Support)' : '(Customer)'}</span>
                            <span>·</span>
                            <span>{formatTime(message.createdAt)}</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
