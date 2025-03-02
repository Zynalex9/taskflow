import { useContext } from "react";
import "./App.css";
import { socketContext } from "./context/SocketContext";


function App() {
  const ws = useContext(socketContext);
  return (
    <>
      <h1 className="text-3xl font-bold underline bg-red-500 ">Hello world!</h1>
    </>
  );
}

export default App;
