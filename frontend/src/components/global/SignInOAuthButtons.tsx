import { useAuth, useSignIn } from "@clerk/react";
import { Button } from "../ui/button";

const SignInOAuthButtons = () => {
  const { signIn } = useSignIn();
  const { isLoaded } = useAuth();

  if (!isLoaded) return null;

  const signInWithGoogle = async () => {
    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/auth-callback",
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  return (
    <Button
      onClick={signInWithGoogle}
      variant="secondary"
      className="w-full text-white border-zinc-200 h-11"
    >
      <img src="/google.png" alt="Google" className="size-5" />
      Continue with Google
    </Button>
  );
};

export default SignInOAuthButtons;
