import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { Loader } from "lucide-react";
import { useChatStore } from "../stores/useChatStore";
import { useAuthStore } from "../stores/useAuthStore";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const connectSocket = useChatStore((s) => s.connectSocket);
  const disconnectSocket = useChatStore((s) => s.disconnectSocket);
  const checkAdmin = useAuthStore((s) => s.checkAdmin);
  const resetAdmin = useAuthStore((s) => s.resetAdmin);

  useEffect(() => {
    if (!isSignedIn) return;
    connectSocket();
    return () => disconnectSocket(); // sign out / unmount
  }, [isSignedIn, connectSocket, disconnectSocket]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) checkAdmin();
    else resetAdmin();
  }, [isLoaded, isSignedIn, checkAdmin, resetAdmin]);

  if (!isLoaded)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <>{children}</>;
};

export default AuthProvider;
