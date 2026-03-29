import React, { useEffect } from "react";
import "../styles/TableStyles.css";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

const UIPage = () => {
  const { userStates, actions } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const locations = useLocation();
  const navigate = useNavigate();
  const searchedUser = locations.search.split("=");
  const searchedList = filterer();

    
  const itemsPerPage = 5;
  const totalItems = searchedList.length;
  const maxPage = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage-1) * itemsPerPage;
  const end =  currentPage*itemsPerPage;
  const visibleUsers = searchedList.slice(start, end);
  useEffect(() => {
    setCurrentPage(1);
  },[userStates.input])

  function sorter(e) {
    const sortPref = e.target.value;
    if (sortPref === "select") return false;
    navigate(`/?sort=${sortPref}`);
  }
  function filterer() {
    if (searchedUser) {
      if (searchedUser[0] === "?sort") {
        switch (searchedUser[1]) {
          case "name": return userStates.data.toSorted((user1, user2) =>
            user1.name.localeCompare(user2.name));
            break;
          case "id": return userStates.data.toSorted((userId1, userId2) => userId1.id - userId2.id);
            break;
          default : return userStates.data.toSorted(
            (userId1, userId2) => userId1.id - userId2.id,
          );
        }
        
      }
        if(searchedUser[0]==="?search") { return userStates.data.filter(u => u.name.toUpperCase().includes(searchedUser[1].toUpperCase())) 
        }
    }
    return userStates.data;
    
    }
  
  function pageSetter(e) {
    setCurrentPage(pr => {
      if (e === "next") {
        if (pr < maxPage) return pr + 1;
        return pr;      
      };
      if (e === "previous") {
        if (pr >1) return pr-1;
        return pr;
      }
    })
  }
  function UImsger() {
    if (userStates.phase !== "idle") return false;
    if (userStates.data.length < 1) return "NO USERS AVAILABLE";
    if (visibleUsers.length < 1) return "no matching users found";
  }

  return (
    <>
      {userStates.data && (
        <div style={{ display: "inline", margin:"5px" }}>
          <label htmlFor="sort">sort</label>
          <select id="sort" onChange={(e) => sorter(e)}>
            <option>select</option>
            <option>name</option>
            <option>id</option>
          </select>
        </div>
      )}
      {currentPage > 1 && (
        <button
          style={{ display: "inline" }}
          onClick={() => pageSetter("previous")}
        >
          previous
        </button>
      )}
      {currentPage < maxPage && (
        <button
          style={{ display: "inline" }}
          onClick={() => pageSetter("next")}
        >
          Next
        </button>
      )}
      {visibleUsers.length < 1 ? (
        UImsger()
      ) : (
        <div>
          <table className="my-table">
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
              {visibleUsers.map((e, i) => {
                return (
                  <tr key={e.id}>
                    <td>{i + 1}</td>
                    <td>{e.id}</td>
                    <td>
                      <Link className="my-user" to={`/userDetail/${e.id}`}>
                        {e.name}
                      </Link>
                    </td>
                    <td>{e.email}</td>
                    <td>{e.company.name}</td>
                    <td>
                      <button
                        onClick={() => actions.deleteConfirmDilogue(e.id)}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
export default UIPage;
