import { useEffect } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import AllRoutes from "./routes/AllRoutes";
import NavBar from "./components/Navbar/NavBar";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  return (
    <>
      <NavBar />
      <AllRoutes />
    </>
  );
}

export default App;
