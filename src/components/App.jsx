import React, { useEffect, useRef, useState } from "react";
import Header from "./Header.jsx";
import UIMsg from "./UIMsg.jsx";
import Search from "./Search.jsx";
import ChildContext from "./ChildContext.jsx";
import { useNavigate } from "react-router-dom";
import FakeUsers from "./FakeUsers.jsx";
import DeleteModel from "./DeleteModel.jsx";

const url = "https://jsonplaceholder.typicode.com/users";
const App = () => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [state, setState] = useState({
    phase: "loading",
    status: "load",
    action: null,
    deleteId: null,
  });
  const ref = useRef();
  const navigate = useNavigate();

  function inputSetter(e) {
    const valueInInputTerminal = e.target.value;
    if (valueInInputTerminal) {
      setInput(valueInInputTerminal);
    }
    if (!valueInInputTerminal) {
      setInput("");
      return navigate("/");
    }
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      navigate(`/?search=${valueInInputTerminal}`);
    }, 500);
  }
  async function wait() {
    return new Promise((res) => setTimeout(res, 1000));
  }

  function updateState(state) {
    setState((pr) => ({ ...pr, ...state }));
  }
  async function fetcher() {
    updateState({ phase: "loading", status: "load" });
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json) setData(json);
      else setData([]);
      updateState({ phase: "idle", status: null });
    } catch {
      await wait();
      updateState({ phase: "error", status: "serverError" });
    }
  }

  useEffect(() => {
    fetcher();
  }, []);

  function deleteConfirmDilogue(id) {
    updateState({ deleteId: id });
  }
  async function deleter(id) {
    if (id === null) return updateState({ deleteId: null });
    try {
      const newData = data.filter((u) => u.id !== id);
      setData(newData);
      updateState({ status: "deleted" });
    } catch {
      updateState({ phase: "error", status: "deleteFailed" });
    } finally {
      await wait();
      updateState({ status: null, deleteId: null });
    }
  }

  return (
    <>
      {state.deleteId !== null && (
        <DeleteModel deleteId={state.deleteId} deleter={deleter} />
      )}
      <div>
        <Header />
        <UIMsg status={state.status} fetcher={fetcher} />
        <Search
          data={data}
          input={input}
          inputSetter={inputSetter}
          phase={state.phase}
        />
        {state.phase === "loading" && <FakeUsers />}

        <ChildContext
          phase={state.phase}
          data={data}
          input={input}
          deleteConfirmDilogue={deleteConfirmDilogue}
          deleter={deleter}
        />
      </div>
    </>
  );
};

export default App;
