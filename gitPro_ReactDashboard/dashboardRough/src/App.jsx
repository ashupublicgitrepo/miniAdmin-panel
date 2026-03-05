import React, { useEffect, useState } from "react";
import Header from "./Header";
import UIBox from "./UIBox";
import Form from "./Form";
import UIMsg from "./UIMsg";
const App = () => {
  const [task, setTask] = useState([]);
  const [data, setData] = useState("");
  const [state, setState] = useState({
    phase: "idle",
    status: null,
    action: null,
    targetId: null,
    editingId:null,
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
   if (state.phase === "loading") return false;
   if (data.length < 1) {
     stateSetter({ phase: "idle", status: "emptyInput", action: null });
     return;
   };
   try {
     if (state.editingId) {
      stateSetter({
        phase: "loading",
        action: "taskButton",
        status: "taskEditing",
      });
       const editedList = [...task];
       editedList[state.targetId].title = data;
       await server();
       setTask(editedList);
       stateSetter({
         phase: "idle",
         status: "edited",
         action: null,
         editingId: null,
         targetId:null
       });
        stateSetter({ phase: "idle", status: "edited", action: null });
     } else {
        stateSetter({
          phase: "loading",
          action: "taskButton",
          status: "taskAdding",
        });
        await wait();
        await server();
        const newTask = {
          id: Date.now(),
          title: data,
          status: "pending",
        };
        setTask((pr) => [...pr, newTask]);
        stateSetter({ phase: "idle", status: "uploaded", action: null });
         
      }
    }catch {
     stateSetter({ phase: "error", status: "uploadFailed", action: null });
   } 
   finally {
     setData("");
     stateSetter({phase:"idle", action:null, targetId:null, editingId:null})
     await wait();
   }
  }
  function dataSetter(e) {
    const data = e.target.value;
    setData(data); 
  }
  async function taskDeleter(indexNum, id) {
    if (state.phase === "loading") return false;
    stateSetter({ phase: "loading", status: "taskDelete", action: "delete", targetId:id });
    const taskListNew = [...task];
    try {
      await server();
      taskListNew.splice(indexNum, 1);
      stateSetter({ phase: "success", status: "deleted", action: null, targetId:null });
      await wait();
      setTask(taskListNew);
    } catch {
      stateSetter({ phase: "error", status: "deleteFailed", action: null });
    } finally {
      await wait();
      
      stateSetter({ phase: "idle", status: null, action: null, targetId: null });
    }
  };
  function editorData(id, index) {
    const taskToEdit = task.find(t => t.id == id);
    stateSetter({targetId: index, editingId: id, status:"editProgress" });
    setData(taskToEdit.title);
  }
 
 
 
  return (
    <>
      <Header />
      <Form
        data={data}
        taskAdder={taskAdder}
        disable={state.phase}
        dataSetter={dataSetter}
      />
      <UIMsg status={state.status} />
      <UIBox
        task={task}
        editorData={editorData}
        taskDeleter={taskDeleter}
        targetId={state.targetId}
        phase={state.phase}
      />
      {/* <button onClick={localToSever}>refresh</button> */}
    </>
  );
};
export default App;
