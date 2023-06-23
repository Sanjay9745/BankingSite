import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css"
function Navbar() {
  return (
    <>
      <div className="nav-container">
        <h2>ABC BANK</h2>
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/deposit">Deposit</Link>
                </li>
                <li>
                    <Link to="/withdraw">Withdraw</Link>
                </li>
                <li>
                    <Link to="/transfer">Transfer</Link>
                </li>
                <li>
                    <Link to="/statement">Statement</Link>
                </li>
                <li>
                    <Link to="/login" style={{color:"red"}} onClick={()=>localStorage.removeItem("token")}>Logout</Link>
                </li>
            </ul>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
