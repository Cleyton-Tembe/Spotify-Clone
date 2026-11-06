import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { Loader } from "lucide-react";
import { useChatStore } from "../stores/useChatStore";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const connectSocket = useChatStore((s) => s.connectSocket);
  const disconnectSocket = useChatStore((s) => s.disconnectSocket);

  useEffect(() => {
    if (!isSignedIn) return;
    connectSocket();
    return () => disconnectSocket(); // sign out / unmount
  }, [isSignedIn, connectSocket, disconnectSocket]);

  if (!isLoaded)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <>{children}</>;
};

export default AuthProvider;
