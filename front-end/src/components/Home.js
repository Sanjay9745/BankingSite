import React, { useEffect, useState } from 'react'
import "../styles/user.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Home() {
  const navigate = useNavigate();
  const [user,setUser] 	= useState(null)
  useEffect(() => {
    const headers={
       "Content-Type": "application/json",
       "x-access-token": localStorage.getItem("token"),
     }
     let token = localStorage.getItem("token");
     if (token) {
       axios("/api/protected", { headers })
         .then((res) => {
           if (res.status === 200) {
            axios.get("/api/details",{headers}).then((res)=>{
              if(res.status===200){
                setUser(res.data)
              }
            })
          }else{
            
            navigate("/register", { replace: true });
           }
         })
         .catch((res) => {
           localStorage.removeItem("token");
           navigate("/register", { replace: true });
         });
     }else{
        navigate("/register")
       }
   }, [navigate]);
  return (
    <>
    <div className='container user'>
      <div className='user-container'>
        <div> 
          <h1>Welcome User</h1>

        </div>
        <div>
          <h2>Your ID</h2> <p>{user?.id}</p>
        </div>
        <div className='bottom-user-div'>
          <h2>Your Balance</h2> <p>{user?.amount} INR</p>

        </div>
      </div>
      </div>
    </>
  )
}

export default Home
