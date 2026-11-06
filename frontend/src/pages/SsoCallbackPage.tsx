import { HandleSSOCallback } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const SsoCallbackPage = () => {
  const navigate = useNavigate();

  const goTo = (path: string, decorateUrl?: (url: string) => string) => {
    const destination = decorateUrl ? decorateUrl(path) : path;
    if (destination.startsWith("http")) window.location.href = destination;
    else navigate(destination, { replace: true });
  };

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <Loader className="size-8 text-emerald-500 animate-spin" />
      <HandleSSOCallback
        navigateToApp={({ decorateUrl }) => goTo("/auth-callback", decorateUrl)}
        navigateToSignIn={() => goTo("/")}
        navigateToSignUp={() => goTo("/")}
      />
    </div>
  );
};

export default SsoCallbackPage;
