import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import SeafoodDetail from "@/pages/SeafoodDetail";
import OrderTrack from "@/pages/OrderTrack";
import StaffDashboard from "@/pages/StaffDashboard";
import BoardView from "@/pages/BoardView";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seafood/:id" element={<SeafoodDetail />} />
        <Route path="/order/:id" element={<OrderTrack />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/board" element={<BoardView />} />
      </Routes>
    </Router>
  );
}
