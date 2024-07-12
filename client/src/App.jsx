import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import ChatPage from "./pages/Chat";
import RoomPage from './pages/Room'
import RegisterPage from "./pages/Register";
import ProtectedRoute from "./lib/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/room" element={<RoomPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
