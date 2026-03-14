import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import UIPage from "./UIPage.jsx";
import UIMsg from "./UIMsg.jsx";
import Search from "./Search.jsx";

const url = "https://jsonplaceholder.typicode.com/users?_limit=10";
const App = () => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [state, setState] = useState({
    status: "load",
    phase:"loading",
    
  });
   function inputSetter(e) {
     const input = e.target.value;
     setInput(input);
   }
  async function wait() {
    return new Promise(res=>setTimeout(res,500))
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
      await wait();
      updateState({ phase: "idle", status: null });
    } catch {
      await wait();
      updateState({ phase: "error", status: "serverError" });
    }
  }
  useEffect(() => {
    fetcher();
  }, []);

  return (
    <>
      <Header />
      <Search input={input} inputSetter={inputSetter} phase={state.phase} />
      <UIMsg status={state.status} fetcher={fetcher} />

        <UIPage phase={state.phase} data={data} input={input}  />
    </>
  );
};

export default App;
