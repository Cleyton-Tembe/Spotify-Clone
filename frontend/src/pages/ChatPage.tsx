import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@clerk/react";
import { Send } from "lucide-react";
import NavBar from "../components/global/NavBar";
import { ScrollArea } from "../components/ui/scroll-area";
import { useChatStore } from "../stores/useChatStore";

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatPage = () => {
  const { isSignedIn, userId } = useAuth();
  const {
    users,
    fetchUsers,
    onlineUsers,
    selectedUser,
    setSelectedUser,
    messages,
    isLoadingMessages,
    sendMessage,
    isConnected,
  } = useChatStore();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSignedIn) fetchUsers();
  }, [isSignedIn, fetchUsers]);

  // Leave the conversation when leaving the page
  useEffect(() => () => setSelectedUser(null), [setSelectedUser]);

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, selectedUser]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !text.trim()) return;
    sendMessage(selectedUser.clerkId, text);
    setText("");
  };

  return (
    <main className="h-full flex flex-col rounded-md overflow-hidden bg-linear-to-b from-zinc-800 to-zinc-900">
      <NavBar />

      {!isSignedIn ? (
        <div className="flex-1 flex items-center justify-center text-zinc-400">
          Log in to chat with your friends.
        </div>
      ) : (
        <div className="flex-1 min-h-0 grid grid-cols-[80px_1fr] lg:grid-cols-[300px_1fr]">
          {/* Users list */}
          <div className="border-r border-zinc-800 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-2 lg:p-4">
                {users.map((user) => {
                  const isOnline = onlineUsers.has(user.clerkId);
                  const isSelected = selectedUser?.clerkId === user.clerkId;
                  return (
                    <button
                      type="button"
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`flex w-full items-center justify-center lg:justify-start gap-3 p-2 lg:p-3 rounded-lg text-left transition-colors ${
                        isSelected ? "bg-zinc-800" : "hover:bg-zinc-800/50"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={user.imageUrl}
                          alt={user.fullName}
                          className="size-10 lg:size-12 rounded-full object-cover"
                        />
                        <span
                          className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-zinc-900 ${
                            isOnline ? "bg-green-500" : "bg-zinc-500"
                          }`}
                        />
                      </div>
                      <div className="hidden lg:block min-w-0">
                        <p className="font-medium truncate">{user.fullName}</p>
                        <p className="text-xs text-zinc-400">
                          {isOnline ? "Online" : "Offline"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Conversation */}
          {!selectedUser ? (
            <div className="flex flex-col items-center justify-center gap-2 text-center p-6">
              <img
                src="/spotify.png"
                alt=""
                className="size-16 animate-bounce"
              />
              <h3 className="text-xl font-semibold">
                No conversation selected
              </h3>
              <p className="text-sm text-zinc-400">
                Choose a friend to start chatting.
              </p>
            </div>
          ) : (
            <div className="flex flex-col min-h-0">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-zinc-800 shrink-0">
                <img
                  src={selectedUser.imageUrl}
                  alt={selectedUser.fullName}
                  className="size-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {selectedUser.fullName}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {onlineUsers.has(selectedUser.clerkId)
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 space-y-3">
                  {isLoadingMessages && (
                    <p className="text-center text-sm text-zinc-400">
                      Loading messages…
                    </p>
                  )}
                  {!isLoadingMessages && messages.length === 0 && (
                    <p className="text-center text-sm text-zinc-400">
                      No messages yet. Say hi 👋
                    </p>
                  )}

                  {messages.map((message) => {
                    const isMine = message.senderId === userId;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                            isMine
                              ? "bg-green-500 text-black rounded-br-sm"
                              : "bg-zinc-800 text-white rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <p
                            className={`text-[10px] mt-1 ${isMine ? "text-black/60" : "text-zinc-400"}`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="flex gap-2 p-4 border-t border-zinc-800 shrink-0"
              >
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={isConnected ? "Type a message" : "Connecting…"}
                  maxLength={2000}
                  aria-label="Message"
                  className="flex-1 min-w-0 rounded-full bg-zinc-800 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || !isConnected}
                  aria-label="Send"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-black hover:bg-green-400 transition-colors disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default ChatPage;
