import React from "react";
import Form from "./Form";
const UIBox = ({
  task,
  taskDeleter,
  targetId,
  phase,
  editorData,
  completer,
  action
}) => {


  
  return ( <>
      <table border={"1px"}>
        <thead>
          <tr>
            <th>sr.no.</th>
            <th>title</th>
            <th>status</th>
            <th>edit</th>
            <th>check</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
          {task &&
            task.map((e, i) => {
              return (
                <tr key={e.id}>
                  <td>{i + 1}</td>
                  <td>{e.title}</td>
                  <td>{e.status}</td>
                  <td>
                    <button
                      disabled={e.status === "completed" || e.id == targetId && action === "editButton"}
                      onClick={() => editorData(e.id)}
                    >
                      edit
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={phase === "loading" && e.id === targetId}
                      onClick={() => completer(e.id)}
                    >
                      {phase === "loading" && targetId === e.id && action === "marker" ? "...updating" : e.status === "completed" ? "mark as pending" : "mark as complete"}
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={phase === "loading" && targetId == e.id && action == "delete"}
                      onClick={() => taskDeleter(e.id)}
                    >
                      {phase === "loading" && targetId == e.id && action === "delete"
                        ? "...Deleting"
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>

  );
};
export default UIBox;
