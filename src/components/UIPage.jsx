import React, { useEffect } from "react";
import "../styles/TableStyles.css";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

const UIPage = () => {
  const { userStates, actions } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const searchVal = urlParams.get("search");
  const sortVal = urlParams.get("sort");
  const searchedList = filterer();

  const itemsPerPage = 5;
  const totalItems = searchedList.length;
  const maxPage = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = currentPage * itemsPerPage;
  const visibleUsers = searchedList.slice(start, end);
  useEffect(() => {
    setCurrentPage(1);
  }, [userStates.input]);

  function sorter(e) {
    const sortPref = e.target.value;
    if (sortPref === "select") navigate("/");
    else {
      navigate(`/?sort=${sortPref}${searchVal ? `&search=${searchVal}` : ""}`);
    }
  }
  function filterer() {
    let list = [...userStates.data];

    if (searchVal) {
      return list.filter((u) =>
        u.name.toUpperCase().includes(searchVal.toUpperCase()),
      );
    }
    if (sortVal) {
      switch (sortVal) {
        case "name":
          return list.toSorted((user1, user2) =>
            user1.name.localeCompare(user2.name),
          );
          break;
        case "id":
          return list.toSorted((userId1, userId2) => userId1.id - userId2.id);
          break;
        default:
          return list.toSorted((userId1, userId2) => userId1.id - userId2.id);
      }
    }

    return list;
  }

  function pageSetter(e) {
    setCurrentPage((pr) => {
      if (e === "next") {
        if (pr < maxPage) return pr + 1;
        return pr;
      }
      if (e === "previous") {
        if (pr > 1) return pr - 1;
        return pr;
      }
    });
  }
  function UImsger() {
    if (userStates.phase !== "idle") return false;
    if (userStates.data.length < 1) return "NO USERS AVAILABLE";
    if (visibleUsers.length < 1) return "no matching users found";
  }

  return (
    <>
      {userStates.data && (
        <div style={{ display: "inline", margin: "5px" }}>
          <label htmlFor="sort">sort</label>
          <select
            id="sort"
            value={sortVal || "select"}
            onChange={(e) => sorter(e)}
          >
            <option value="select">select</option>
            <option value="name">name</option>
            <option value="id">id</option>
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
