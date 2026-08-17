import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/home/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import ReelsPage from "./pages/reels/ReelsPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/profile/ProfilePage";
import FriendsPage from "./pages/friends/FriendsPage";


function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
