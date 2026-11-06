import { Show, UserButton } from "@clerk/react";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "../../stores/useAuthStore";

const NavBar = () => {
  const isAdmin = useAuthStore((s) => s.adminStatus === "admin");

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        <img src="/spotify.png" className="size-8" alt="Spotify logo" />
        Spotify
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <LayoutDashboard className="size-4" />
            <span className="hidden sm:inline">Admin Dashboard</span>
          </Link>
        )}

        {/* Only when signed OUT: the Google button */}
        <Show when="signed-out">
          <SignInOAuthButtons />
        </Show>

        {/* Only when signed IN: avatar menu (has "Sign out" inside) */}
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </div>
  );
};

export default NavBar;
