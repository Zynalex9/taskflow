import { useEffect } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import AllRoutes from "./routes/AllRoutes";
import { socket } from "./socket/socket";
import { Toaster } from "./components/ui/sonner";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  console.log(import.meta.env.VITE_BASE_URL);
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  socket.on("connect", () => {
    console.log("Connected to socket:", socket.id);
  });
  return (
    <>
      <AllRoutes />
      <Toaster  theme="dark"/>
    </>
  );
}

export default App;
