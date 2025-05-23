import { useEffect } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import AllRoutes from "./routes/AllRoutes";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  console.log(import.meta.env.VITE_BASE_URL);
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
