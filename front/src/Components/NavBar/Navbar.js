import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div className="navbar">
        <div className="navbar__logo">
          <h1 className="navbar__title">
            <Link to="/index">Mtx</Link>
          </h1>
        </div>
        <div className="navbar__linksbox">
          <ul className="navbar__links">
            <li className="navbar__onelink navbar__onelinkFirst">
              <Link to="/index">Home</Link>
            </li>
            <li className="navbar__onelink">
              <Link to="/collection">Collection</Link>
            </li>
            <li className="navbar__onelink">
              <Link to="/addcard">Add Card</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
