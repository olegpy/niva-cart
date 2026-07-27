import { sendAdminReplyAction, SendAdminReplyState } from "@/features/support/actions/sendAdminReply";
import { useSupportSocket } from "@/features/support/hooks/useSupportSocket";
import { appendUniqueMessage } from "@/features/support/lib/appendUniqueMessage";
import { formatTime } from "@/features/support/lib/formatTime";
import { ChatMessage, SupportChat } from "@/features/support/types";
import { SUPPORT_ROLE } from "@niva/support-realtime";
import { Alert, Button, Input } from "@/shared/components/ui";
import { useActionState, useCallback, useId, useState } from "react";

export function AdminChatDetails({ chat }: { chat: SupportChat }) {
    const [messages, setMessages] = useState<ChatMessage[]>(chat.messages);

    const handleSocketMessage = useCallback((message: ChatMessage) => {
      setMessages((prev) => appendUniqueMessage(prev, message));
    }, []);

    useSupportSocket({
      chatId: chat.id,
      role: SUPPORT_ROLE.ADMIN,
      onMessage: handleSocketMessage,
    });

    const [state, formAction, isPending] = useActionState(async (
        prevState: SendAdminReplyState,
        formData: FormData,
      ): Promise<SendAdminReplyState> => {
        const result = await sendAdminReplyAction(prevState, formData);
        if (result.ok === true) {
          setMessages((prev) => appendUniqueMessage(prev, result.data));
        }
        return result;
      },
      {} as SendAdminReplyState,
    );


    const errorId = useId();
    const hasError = state.ok === false;

    return (
        <>
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{chat.name}</h2>
                <p className="text-sm text-gray-500">{chat.email}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[480px]">
                { messages.map((message: ChatMessage) => {
                    const isAdmin = message.authorRole === SUPPORT_ROLE.ADMIN;

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
                    )
                }) }
            </div>
            <div className="border-t border-gray-200 p-4">
                {hasError && <Alert id={errorId}>{state.error}</Alert>}
                <form action={formAction} className="flex gap-2" aria-label="Reply to customer">
                    <input type="hidden" name="chatId" value={chat.id} />
                    <Input
                        name="text"
                        type="text"
                        required
                        placeholder="Reply to customer…"
                        aria-label="Reply"
                        className="min-w-0 flex-1"
                        disabled={isPending}
                    />
                    <Button type="submit" loading={isPending}>
                        Reply
                    </Button>
                </form>
            </div>
        </>
    )
}
