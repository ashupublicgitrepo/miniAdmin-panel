import { useState } from "react";
import React  from "react";
import "./TableStyles.css";

const UIPage = ({ data, input, phase }) => {
  
   
 
    const userList = data.filter(u => {
      if (input.length < 1) return u;
      else return u.name.toUpperCase().includes(input.trim().toUpperCase());
    });
 
  
  
    
  return (
    <>
      
{phase === "idle" && (        <table className="my-table">
          <thead>
            <tr>
              <th>sr. no.</th>
              <th>id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((e, i) => {
              return (
                <tr key={e.id} >
                  <td>{i + 1}</td>
                  <td>{e.id}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.company.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
)}                 
        </>
  )

}
export default UIPage;