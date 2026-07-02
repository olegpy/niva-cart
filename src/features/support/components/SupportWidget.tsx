'use client';

import { useActionState, useEffect, useId, useState } from 'react';
import {
  startChatAction,
  type StartChatState,
} from '@/features/support/actions/startChat';
import {
  Alert,
  Button,
  FormField,
  Input,
  Textarea,
  formButtonClassName,
} from '@/shared/components/ui';

const VIEW = {
  form: 'form',
  chat: 'chat',
} as const;

type View = (typeof VIEW)[keyof typeof VIEW];

const DEMO_MESSAGES = [
  {
    id: '1',
    authorRole: 'customer' as const,
    authorName: 'You',
    text: 'Hi, I have a question about my order.',
    createdAt: '10:32 AM',
  },
  {
    id: '2',
    authorRole: 'admin' as const,
    authorName: 'Support',
    text: 'Hello! Happy to help — what is your order number?',
    createdAt: '10:33 AM',
  },
];

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>(VIEW.form);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Support"
          className="flex h-[min(560px,calc(100vh-6rem))] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-200 bg-red-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold leading-tight">Customer support</p>
                <p className="text-xs text-red-100">We usually reply within a few minutes</p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={closeModal}
              aria-label="Close"
              className="p-1.5 text-white/90 hover:bg-white/20 hover:text-white focus-visible:ring-white/50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {view === VIEW.form ? (
            <SupportForm onSuccess={() => setView(VIEW.chat)} />
          ) : (
            <SupportChat onBack={() => setView(VIEW.form)} />
          )}
        </div>
      )}

      <Button
        type="button"
        onClick={() => (isOpen ? closeModal() : openModal())}
        aria-label={isOpen ? 'Close support chat' : 'Contact support'}
        aria-expanded={isOpen}
        className="w-auto gap-2 rounded-full shadow-lg py-3 pl-4 pr-5"
      >
        {isOpen ? (
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
        {isOpen ? 'Close' : 'Support'}
      </Button>
    </div>
  );
}

const initialStartChatState: StartChatState = {};

function SupportForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState(
    startChatAction,
    initialStartChatState,
  );
  const errorId = useId();
  const hasError = Boolean(state.error);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5">
      <p className="mb-5 text-sm text-gray-600">
        Tell us how we can help. We will reply here in this chat.
      </p>

      <form action={formAction} className="flex flex-col gap-4" aria-label="Start support chat">
        {hasError && <Alert id={errorId}>{state.error}</Alert>}

        <FormField
          label="Full name"
          id="support-name"
          labelClassName="mb-1.5"
          invalid={hasError}
          describedBy={hasError ? errorId : undefined}
        >
          <Input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Anna Smith"
          />
        </FormField>

        <FormField
          label="Email"
          id="support-email"
          labelClassName="mb-1.5"
          invalid={hasError}
          describedBy={hasError ? errorId : undefined}
        >
          <Input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="anna@example.com"
          />
        </FormField>

        <FormField
          label="Your question"
          id="support-question"
          labelClassName="mb-1.5"
          invalid={hasError}
          describedBy={hasError ? errorId : undefined}
        >
          <Textarea
            name="question"
            rows={4}
            required
            placeholder="How can we help?"
          />
        </FormField>

        <Button type="submit" loading={isPending} className={formButtonClassName}>
          {isPending ? 'Starting chat…' : 'Start chat'}
        </Button>
      </form>
    </div>
  );
}

function SupportChat({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {DEMO_MESSAGES.map((message) => {
          const isCustomer = message.authorRole === 'customer';

          return (
            <div
              key={message.id}
              className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  isCustomer ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div
                  className={`mb-0.5 flex items-center gap-1.5 text-xs ${
                    isCustomer ? 'text-red-100' : 'text-gray-500'
                  }`}
                >
                  <span className="font-medium">{message.authorName}</span>
                  <span>·</span>
                  <span>{message.createdAt}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 p-4">
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()} aria-label="Send a message">
          <Input
            type="text"
            placeholder="Type a message…"
            aria-label="Message"
            className="min-w-0 flex-1"
          />
          <Button type="submit" size="icon" aria-label="Send message">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </form>

        <Button type="button" variant="link" onClick={onBack} className="mt-3 p-0 h-auto rounded-none">
          Back to form (preview)
        </Button>
      </div>
    </div>
  );
}
