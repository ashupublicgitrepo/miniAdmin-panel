import React, { useEffect, useState } from "react";
import Header from "./Header";
import UIBox from "./UIBox";
import Form from "./Form";
import UIMsg from "./UIMsg";
let rejectCount=1;
const App = () => {
  const [task, setTask] = useState(() => {
   try{ const localSavedTasks = localStorage.getItem("task");
      return localSavedTasks ? JSON.parse(localSavedTasks) : [];
    }
    catch {
      return [];
    }
  });
   const [filter, setFilter] = useState("all");
  const [data, setData] = useState("");
  const [state, setState] = useState({
    phase: "idle",
    status: null,
    action: null,
    targetId: null,
   
  });
  useEffect(() => {
     const localTask = [...task];
     const stringList = JSON.stringify(localTask);
    localStorage.setItem("task", stringList);
  }, [task]);
  useEffect(() => {
    async function fetcher() {
      try{stateSetter({ phase: "loading", action: "fetching" });
      await server(); 
        stateSetter({ phase: "idle", action: null });
      } catch {
        stateSetter({ status: "fetchFailed", action:"fetching" });
      }
    }
    fetcher();
  },[]);
   
  
  function server() {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (rejectCount % 6 == 0) {
          console.log('promise is rejected.')
          rej();
        } else {
          res();
        }
        rejectCount++;
        
      }, 800);
    })
  }
  function wait() {
    return new Promise(res => setTimeout(res, 200));
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
     if (state.targetId) {
      stateSetter({
        phase: "loading",
        action: "taskButton",
        status: "taskEditing",
      });
       const editedList = task.map(t => t.id === state.targetId ? {...t,title:data}:t);
       await server();
       setTask(editedList);
       stateSetter({
         phase: "idle",
         status: "edited",
         action: null,
         targetId:null
       });
       
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
     
   
   }
  }
  function dataSetter(e) {
    const data = e.target.value;
    setData(data); 
  }
  async function taskDeleter(id) {
    if (state.phase === "loading") return false;
    stateSetter({ phase: "loading", status: "taskDelete", action: "delete", targetId:id });
    const taskListNew = task.filter(t => t.id !== id);
    
    try {
      await server()
      stateSetter({ phase: "success", status: "deleted", action: null, targetId:null });
      await wait();
      setTask(taskListNew);
    } catch {
      stateSetter({ phase: "error", status: "deleteFailed", action: null });
    } finally {
      await wait();
      stateSetter({ phase: "idle", action: null, targetId: null });
      
    }
  };
  function editorData(id) {
    if (state.phase === "loading") return false;
    stateSetter({ phase: "idle", status: "editProgress", action:"editButton",targetId: id });
    const taskToEdit = task.find(t => t.id === id);
    setData(taskToEdit.title);
  }
  async function completer(id) {
    if (state.phase === "loading") return false;
    stateSetter({ phase: "loading", status: "marking", action: "marker", targetId:id });
    await wait();
    try { 
      const completedList = task.map(t => {
        if (t.id === id) {
         return  t.status === "pending" ? { ...t, status: "completed" } : { ...t, status: "pending" };
        } else {
          return t;
        }
      } );
      await server();
      setTask(completedList);
      stateSetter({status:"marked"})
    } catch {
      stateSetter({status:"markError"})
    }
    finally {
      await wait();
      stateSetter({ phase: "idle", action: null, targetId: null, });
      setData("");
    }
 }
  function taskFilterer(e) {
   
    setFilter(e);
 }
 
  return (
    <>
      <Header />
      <Form
        targetId={state.targetId}
        data={data}
        taskAdder={taskAdder}
        disable={state.phase}
        dataSetter={dataSetter}
        action={state.action}
      />
      <UIMsg status={state.status} />
      {state.phase === "loading" && state.action === "fetching" ? (
        <p>Loading tasks...</p>
      ) : (
          <UIBox
            task={task}
          action={state.action}
          completer={completer}
          editorData={editorData}
          taskDeleter={taskDeleter}
          targetId={state.targetId}
            phase={state.phase}
            filter={filter}
            taskFilterer={taskFilterer}
        />
      )}

     
    </>
  );
};
export default App;
