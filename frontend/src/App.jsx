import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import CreateTrip from "./create-trip/index.jsx";
import TripResult from "./trip-result/TripResult";
import Header from "./components/ui/custom/Header";
import Hero from "./components/ui/custom/Hero";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Profile from "./components/account/Profile.jsx";
import Settings from "./components/account/Settings";
import TripHistory from "./components/account/TripHistory";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Hero/>}/>
         <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/trip-result" element={<TripResult />} />

        <Route path="/profile" element={<Profile />} />
<Route path="/settings" element={<Settings />} />
<Route path="/trip-history" element={<TripHistory />} />

        
<Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;
