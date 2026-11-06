import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useChatStore } from "../../stores/useChatStore";

const FriendsActivity = () => {
  const { isSignedIn } = useAuth();
  const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();

  useEffect(() => {
    if (isSignedIn) fetchUsers();
  }, [isSignedIn, fetchUsers]);

  // Online friends first
  const sorted = [...users].sort(
    (a, b) =>
      Number(onlineUsers.has(b.clerkId)) - Number(onlineUsers.has(a.clerkId)),
  );

  return (
    <div className="h-full flex flex-col rounded-lg bg-zinc-900">
      <div className="flex items-center gap-2 p-4 border-b border-zinc-800 shrink-0">
        <Users className="size-5 shrink-0" />
        <h2 className="font-semibold truncate">What they're listening to</h2>
      </div>

      {!isSignedIn ? (
        <LoginPrompt />
      ) : (
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-2">
            {sorted.map((user) => {
              const isOnline = onlineUsers.has(user.clerkId);
              const activity = userActivities.get(user.clerkId) ?? null;

              return (
                <div
                  key={user._id}
                  className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="relative shrink-0">
                    <img
                      src={user.imageUrl}
                      alt={user.fullName}
                      className="size-10 rounded-full object-cover"
                    />
                    <span
                      aria-label={isOnline ? "Online" : "Offline"}
                      className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-900 ${
                        isOnline ? "bg-green-500" : "bg-zinc-500"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white truncate">
                        {user.fullName}
                      </span>
                      {activity && (
                        <Music className="size-3.5 text-green-500 shrink-0" />
                      )}
                    </div>

                    {activity ? (
                      <div className="mt-1">
                        <p className="text-sm text-white truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {activity.artist}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-zinc-400">
                        {isOnline ? "Idle" : "Offline"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {users.length === 0 && (
              <p className="text-sm text-zinc-400 text-center py-6">
                No other users yet.
              </p>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

const LoginPrompt = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
    <div className="rounded-full bg-linear-to-r from-emerald-500 to-sky-500 p-4">
      <HeadphonesIcon className="size-8 text-black" />
    </div>
    <h3 className="text-lg font-semibold">See what friends are playing</h3>
    <p className="text-sm text-zinc-400">
      Log in to see what music your friends are listening to right now.
    </p>
  </div>
);

export default FriendsActivity;
