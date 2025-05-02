import { useEffect } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import AllRoutes from "./routes/AllRoutes";
import NavBar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
    <ScrollToTop/>
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow">
        <AllRoutes />
      </div>
      <Footer />
    </div>
    </>
  );
}

export default App;
