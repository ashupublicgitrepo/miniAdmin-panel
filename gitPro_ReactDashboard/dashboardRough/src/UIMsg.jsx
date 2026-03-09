import React from "react";

const UIMsg = ({ status }) => {
  const statusMap = {
    emptyInput: "please enter valid input.",
    taskAdding: "please wait, task is adding in list.",
    uploaded: "task added successfully.",
    deleted: "task has been deleted from list successfully.",
    taskEditing: "...task is editing, please wait",
    edited: "task edited successfully.",
    editProgress: "please enter data to edit this task.",
    taskDelete: "task has been ...deleting.",
    marking: "...marking, please wait.",
    marked: "task marked as instructed.",
    markError: "internal server error, task marking failed, please try again.",
    uploadFailed: "internal server error, please try again.",
    deleteFailed: "internal server error, please try again.",
    fetchFailed: "cant get info, please reloade again to load from server.",
  };
  function statusMapper() {
    return statusMap[status];
  }
  return <p>{statusMapper()}</p>;
};

export default UIMsg;
