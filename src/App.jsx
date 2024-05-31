import React from "react";
import Routes from "./Routes/Routes";
import { Toaster } from "react-hot-toast";
// import SocketContext from "./context/Socket/SocketContext";



function App() {
  return (
    <>
      <Routes />
      <Toaster position="top-center" reverseOrder={false} />
     </>
  );
}

export default App;
