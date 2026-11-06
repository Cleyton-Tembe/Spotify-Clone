import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import PlaybackControls from "./components/PlaybackControls";
import AudioPlayer from "./components/AudioPlayer";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <AudioPlayer />

      <ResizablePanelGroup
        orientation="horizontal"
        className="flex-1 min-h-0 overflow-hidden p-2"
      >
        {/* LEFT SIDEBAR — strings = percentages */}
        <ResizablePanel
          defaultSize={isMobile ? "0" : "20"}
          minSize={isMobile ? "0" : "10"}
          maxSize="30"
        >
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* MAIN CONTENT */}
        <ResizablePanel defaultSize={isMobile ? "100" : "60"} minSize="30">
          <Outlet />
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

            {/* FRIENDS ACTIVITY */}
            <ResizablePanel
              defaultSize="20"
              minSize="0"
              maxSize="25"
              collapsible
              collapsedSize="0"
            >
              <FriendsActivity />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <PlaybackControls />
    </div>
  );
};

export default MainLayout;
