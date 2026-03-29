import React from "react";

const DeleteModel = ({ deleter, deleteId }) => {
  const modalOverlay = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",

    background: "rgba(0,0,0,0.4)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const modalBox = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
  };

  return (
    <>
      <div style={modalOverlay}>
        <div style={modalBox}>
          <p>Are you sure</p>
          <button onClick={() => deleter(deleteId)}>confirm</button>
          <button onClick={() => deleter(null)}>cancel</button>
        </div>
      </div>
    </>
  );
};

export default DeleteModel;
