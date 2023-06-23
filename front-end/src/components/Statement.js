import React, { useEffect } from "react";
import "../styles/statement.css";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Statement() {
  const navigate = useNavigate();
  const [data,setData] = useState([])
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
            axios.get("/api/statement",{headers}).then((res)=>{
              if(res.status===200){
                setData(res.data.actions)
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

  const [currentPage, setCurrentPage] = useState(0);



  const itemsPerPage = 5;
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  return (
    <>
      <div className="container user">
        <div className="statement-container">
          <div className="statement-header">Statement of account</div>
          <div className="statement-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.map((item, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{item.date}</td>
                    <td>{item.amount}</td>
                    <td>{item.type}</td>
                    <td>{item.details}</td>
                    <td>{item.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="statement-pagination">
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Statement;
