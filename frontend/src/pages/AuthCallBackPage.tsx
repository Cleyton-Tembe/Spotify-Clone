import { useUser } from "@clerk/react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { Card, CardContent } from "../components/ui/card";
import { Loader } from "lucide-react";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);

  useEffect(() => {
    if (!isLoaded || syncAttempted.current) return;

    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    syncAttempted.current = true;

    axiosInstance
      .post("/auth/callback", {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      })
      .then((res) => console.log("auth callback:", res.data))
      .catch((error) => console.log("Error in auth callback", error))
      .finally(() => navigate("/", { replace: true }));
  }, [isLoaded, user, navigate]);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Loader className="size-6 text-emerald-500 animate-spin" />
          <h3 className="text-zinc-400 text-xl font-bold">Logging you in</h3>
          <p className="text-zinc-400 text-sm">Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default AuthCallbackPage;
