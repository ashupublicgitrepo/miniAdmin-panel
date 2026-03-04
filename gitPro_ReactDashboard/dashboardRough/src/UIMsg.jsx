import React from "react";

const UIMsg = ({status}) => {
    const statusMap = {
        _emptyInput: "please enter valid input.",
        _taskAdding: "please wait, task is adding in list.",
        _uploaded: "task added successfully.",
        _deleted: "task has been deleted from list successfully."
    };
    function statusMapper() {
        return statusMap[status];
    }
  return <p>{statusMapper()}</p>;
};

export default UIMsg;