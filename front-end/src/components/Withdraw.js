import React, { useEffect, useState } from "react";
import "../styles/form.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Withdraw() {
  const [amount, setAmount] = useState(null);
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
          if (res.status !== 200) {
            navigate("/register", { replace: true });
          }
        })
        .catch((res) => {
          localStorage.removeItem("token");
          navigate("/register", { replace: true });
        });
    } else {
      navigate("/register");
    }
  }, [navigate]);
  function handleSubmit(e) {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    };
    axios.get("/api/details", { headers }).then((res) => {
      if (res.status === 200) {
        console.log(res.data)
        if (res.data?.amount > amount) {
          axios
            .post("/api/withdraw", { amount: amount }, { headers })
            .then((res) => {
              if (res.status === 200) {
                setAmount("");
              }
            }).catch((e)=>console.log(e))
        }else{
          toast.error("You Don't sufficient amount of money.Try to withdraw less than"+res.data?.amount)
        }
      }
    }).catch((e)=>console.log(e))
  }
  return (
    <>
      <div className="form-container main">
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>Withdraw Money</h3>
          </div>
          <div className="form-group">
            <label htmlFor="amount" className="bold-label">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-text"
              placeholder="Enter amount to deposit"
            />

            <input type="submit" className="btn btn-info" value="Withdraw" />
          </div>
        </form>
        <ToastContainer/>
      </div>
    </>
  );
}

export default Withdraw;
