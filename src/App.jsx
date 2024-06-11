import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import LandingPage from "./views/landingPage";
import CreateAPie from "./views/createBudget";
import ViewAPie from "./views/viewBudget";
import UpdateAPie from "./views/updateBudget";
import DeleteApie from "./views/deleteBudget";
import LogoutPage from "./views/LogoutPage";
import "@fontsource-variable/sora";
import "@fontsource/krona-one";

function App() {
  useEffect(() => {
    const intervalId = setInterval(refreshTokens, 1000 * 60 * 5); // Refresh tokens every 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  async function refreshTokens() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;
      const response = await fetch("http://localhost:5000/auth/refresh", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        credentials: "include", // Ensure cookies are included in the request
      });
      if (response.ok) {
        const data = await response.json();
        const accessToken = data.accessToken;
        localStorage.setItem("accessToken", accessToken);
      } else {
        console.log("Token refresh failed");
        // Handle token refresh failure, maybe redirect to login page
      }
    } catch (error) {
      console.error("Error refreshing tokens:", error);
    }
  }

  return (
    <>
      <Router basename="/MoneySlice/">
        <Routes>
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/smashAPie" element={<DeleteApie />} />
          <Route path="/updateAPie" element={<UpdateAPie />} />
          <Route path="/createAPie" element={<CreateAPie />} />
          <Route path="/viewAPie" element={<ViewAPie />} />
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signUp" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/landingPage" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
