import React, { useEffect } from "react";
import "./TableStyles.css";
import { useLocation, useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

const UIPage = () => {
  const { userStates, actions } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const locations = useLocation();
  const searchedUser = locations.search.split("=")[1];
  const searchedList = userStates.data.filter(u => {
    if (!userStates.input || !searchedUser) return true;
    return u.name.toUpperCase().includes(searchedUser.toUpperCase())
  })
  const itemsPerPage = 5;
  const totalItems = searchedList.length;
  const maxPage = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage-1) * itemsPerPage;
  const end =  currentPage*itemsPerPage;
  const visibleUsers = searchedList.slice(start, end);
  useEffect(() => {
    setCurrentPage(1);
  },[userStates.input])


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
      {currentPage>1 && <button onClick={() => pageSetter("previous")}>previous</button>}
     {currentPage< maxPage && <button onClick={() => pageSetter("next")}>Next</button>}
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
                      <Link
                        className="my-user"
                        to={`/userDetail/${e.id}`}>
                        {e.name}
                      </Link>
                    </td>
                    <td>{e.email}</td>
                    <td>{e.company.name}</td>
                    <td>
                      <button onClick={() => actions.deleter(e.id)}>
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
