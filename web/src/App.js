import { Routes, Route } from "react-router-dom";

import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import LeaderboardPurchase from "./routes/leaderboard-purchase/leaderboard-purchase.component";
import UserPage from "./routes/users/users.component";
import Checkout from "./components/checkout/checkout.component";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="purchase" element={<LeaderboardPurchase />} />
        <Route path="auth" element={<Authentication />} />
        <Route path="user/*" element={<UserPage />} />
      </Route>
    </Routes>
  );
};

export default App;
