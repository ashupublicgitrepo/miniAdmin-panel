import React, { useEffect, useState } from "react";
import Header from "./Header";
import UIBox from "./UIBox";
import Form from "./Form";
import UIMsg from "./UIMsg";
const App = () => {
  const [task, setTask] = useState([]);
  const [data, setData] = useState("");
  const [state, setState] = useState({
    phase: "_idle",
    status: null,
    action: null,
    targetId:null
  });
  
  // function localSyncher() {
  //   const newLocal = [...task];
  //   const strigifiedTask = JSON.stringify(newLocal);
  //   localStorage.setItem("task", strigifiedTask);
  // }
  // function localToSever() {
  //   if (task.length > 1) return false;
  //   const localStored = JSON.parse(localStorage.getItem("task"));
  //   setTask([...localStored]);
  //   console.log(localStorage.getItem("task"));
  // }
  // today, no local storage saving, list update issues. 
  function server() {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res();
      }, 800);
    })
  }
  function wait() {
    return new Promise(res => setTimeout(res, 100));
  }
  function stateSetter(newSt) {
    setState(pr => ({ ...pr, ...newSt })); 
  }
 async function taskAdder(e) {
   e.preventDefault();
   if (state.phase === "_loading") return false;
   if (data.length < 1) {
     stateSetter({ phase: "_idle", status: "_emptyInput", action: null });
     return;
   };
   stateSetter({ phase: "_loading", action:"_taskButton", status:"_taskAdding" });
   await wait();
   try {
     await server();
     const newTask = {
       id: Date.now(),
       title: data,
       status: "pending"
     };
     stateSetter({ phase: "_idle", status: "_uploaded", action: null });
     await wait();
     setTask(pr => [...pr, newTask]);
     setData("");
     
   } catch {
     stateSetter({ phase: "_error", status: "_uploadFailed", action: null });
   } 

  }
  function dataSetter(e) {
    const data = e.target.value;
    setData(data); 
  }
  async function taskDeleter(indexNum, id) {
    if (state.phase === "_loading") return false;
    stateSetter({ phase: "_loading", status: "_taskDelete", action: "delete", targetId:id });
    const taskListNew = [...task];
    try {
      await server();
      taskListNew.splice(indexNum, 1);
      stateSetter({ phase: "_success", status: "_deleted", action: null, targetId:null });
      await wait();
      setTask(taskListNew);
    } catch {
      stateSetter({ phase: "_error", status: "_deleteFailed", action: null });
    } finally {
      await wait();
      
      stateSetter({ phase: "_idle", status: null, action: null, targetId: null });
    }
  };

 
 
  return (
    <>
      <Header />
      <Form data={data} taskAdder={taskAdder} disable={state.phase} dataSetter={dataSetter}  />
      <UIMsg status ={state.status}   />
      <UIBox task={task} taskDeleter={taskDeleter} targetId={state.targetId} phase={state.phase} />
      {/* <button onClick={localToSever}>refresh</button> */}
    </>
  );
};
export default App;
