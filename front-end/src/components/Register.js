import React, { useEffect, useState } from "react";
import "../styles/form.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false); // Set isChecked to false for checkbox default unchecked state
  const navigate = useNavigate();

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    };
    let token = localStorage.getItem("token");
    if (token) {
      axios("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            navigate("/");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();

    // Validate form inputs
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isChecked) {
      toast.error("Please agree to the terms and policy");
      return;
    }

    axios
      .post("/api/register", { name: name, email: email, password: password })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          navigate("/");
        } else {
          toast.error("User already exists");
        }
      })
      .catch((error) => {
        toast.error("User already exists");
        console.log(error);
      });
  }

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>ABC BANK</h1>
          <div className="form-group">
            <h3>Create new account</h3>
            <label htmlFor="name" className="bold-label">
              Name
            </label>
            <input
              type="text"
              className="input-text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
            <label htmlFor="email" className="bold-label">
              Email address
            </label>
            <input
              type="email"
              className="input-text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            <label htmlFor="password" className="bold-label">
              Password
            </label>
            <input
              type="password"
              className="input-text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <label>
              <input
                type="checkbox"
                className="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)} // Toggle isChecked value when checkbox is clicked
              />
              Agree to the <a href="/">terms and policy</a>
            </label>
            <input type="submit" className="btn btn-info" value="Sign in" />
          </div>
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register
