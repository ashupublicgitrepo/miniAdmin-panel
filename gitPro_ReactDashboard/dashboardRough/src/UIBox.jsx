import React from "react";
const UIBox = ({ task, taskDeleter, targetId, phase }) => {
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
                        return <tr key={e.id}>
                            <td>{i+1}</td>
                            <td>{e.title}</td>
                            <td>{e.status}</td>
                            <td><button>mark as complete</button></td>
                            <td><button disabled={targetId==e.id} onClick={() => taskDeleter(i, e.id)}>{phase === "_loading" && targetId == e.id ? "...Deleting" : "Delete"}</button></td>
                        </tr>
                    })}
                </tbody>
            </table>
            
        </>
    )
}
export default UIBox;