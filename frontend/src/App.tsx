import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthCallbackPage from "./pages/AuthCallBackPage";
import SsoCallbackPage from "./pages/SsoCallbackPage";
import MainLayout from "./layout/MainLayout";
import AlbumPage from "./pages/AlbumPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/sso-callback" element={<SsoCallbackPage />} />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/albums/:albumId" element={<AlbumPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default App;
