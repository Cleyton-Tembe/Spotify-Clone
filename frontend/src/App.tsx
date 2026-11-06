import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthCallbackPage from "./pages/AuthCallBackPage";
import SsoCallbackPage from "./pages/SsoCallbackPage";
import MainLayout from "./layout/MainLayout";
import AlbumPage from "./pages/AlbumPage";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/admin/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/sso-callback" element={<SsoCallbackPage />} />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/albums/:albumId" element={<AlbumPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
