import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProfileDisplay from "./pages/ProfileDisplay";
import Users from "./pages/Users";
import WishlistsContainer from "./pages/WishlistsContainer";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="topbar"></div>
        <Navbar />
        <button onClick={console.log} className="show-navbar-button">
          Show navbar
        </button>
        <main>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lists" element={<WishlistsContainer wishlists={[]} />} />
              <Route path="/profile/:id" element={<ProfileDisplay />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
