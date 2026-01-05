import "./App.css";
import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <MainLayout />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
