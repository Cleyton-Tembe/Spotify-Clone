import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { AuthenticateWithRedirectCallback } from "@clerk/react";
import AuthCallbackPage from "./pages/AuthCallBackPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signInForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
      </Routes>
    </>
  );
}

export default App;
