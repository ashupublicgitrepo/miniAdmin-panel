import React from "react";
import Form from "./Form";
const UIBox = ({ task, taskDeleter, targetId, phase, editorData }) => {

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>sr.no.</th>
                        <th>title</th>
                        <th>status</th>
                        <th>action</th>
                    </tr>
            </thead>
                <tbody>
                    {task && task.map((e, i) => {
                        return (
                          <tr key={e.id}>
                            <td>{i + 1}</td>
                            <td>{e.title}</td>
                            <td>{e.status}</td>
                            <td>
                              <button onClick={() => editorData(e.id, i)}>
                                edit
                              </button>
                            </td>
                            <td>
                              <button
                                disabled={
                                  phase === "loading" &&
                                  targetId == e.id
                                }
                                onClick={() => taskDeleter(i, e.id)}
                              >
                                {phase === "loading" && targetId == e.id
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
    )
}
export default UIBox;