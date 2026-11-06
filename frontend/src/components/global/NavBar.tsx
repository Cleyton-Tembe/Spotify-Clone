import { Show, UserButton } from "@clerk/react";
import SignInOAuthButtons from "./SignInOAuthButtons";

const NavBar = () => {
  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        <img src="/spotify.png" className="size-8" alt="Spotify logo" />
        Spotify
      </div>
      <div className="flex items-center gap-4">
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
