import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import SchedulePage from "../pages/Calendar/CalendarPage";
import CertManage from "../pages/CertManage/CertManage";
import CertSearch from "../pages/CertSearch/CertSearch";
import MyPage from "../pages/MyPage/MyPage";
import LoginPage from "../pages/Login/LoginPage";
import SignupPage from "../pages/Signup/SignupPage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calendar" element={<SchedulePage />} />
      <Route path="/cert-manage" element={<CertManage />} />
      <Route path="/cert-search" element={<CertSearch />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default Router;