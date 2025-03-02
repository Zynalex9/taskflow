import { useEffect } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";

function App() {
  useEffect(() => {
   socketIOClient("http://localhost:3000");
  },[]);
  return (
    <>
      <h1 className="text-3xl font-bold underline bg-red-500 ">Hello world!</h1>
    </>
  );
}

export default App;
