import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav id="nav">
      <ul>
        <div style={{backgroundColor: "black", width: "150px", height: "100px"}}></div>
        <li><Link to="/" style={{ textDecoration: 'inherit' }}><p>Home</p></Link></li>
        <li><Link to="/lists" style={{ textDecoration: 'inherit' }}><p>Wishlists</p></Link></li>
        <li><Link to="/friends" style={{ textDecoration: 'inherit' }}><p>Friends</p></Link></li>
        <li><Link to="/profile" style={{ textDecoration: 'inherit' }}><p>My profile</p></Link></li>
        <li><Link to="/users" style={{ textDecoration: 'inherit' }}><p>All users (ADMIN)</p></Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
