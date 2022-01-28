import "./App.scss";
import Navbar from "./Components/NavBar/Navbar";
import Index from "./Components/Index";
import Collection from "./Components/Collection";
import AddCard from "./Components/AddCard";
import Login from "./Components/Login";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/index" element={<Index />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/addcard" element={<AddCard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
