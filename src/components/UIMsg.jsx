import React from "react";
import "../styles/TableStyles.css";

const UIMsg = ({ status, fetcher }) => {
  
 
    const msgMapper = {
      load: "...loading",
      serverError: "internal server error. Please try again.",
      deleted: "user successfully removed",
      deleteFailed: "server error, please try again."
    
    };
 
    function uimsger() {
        return msgMapper[status];
    }
    return (
      <>
        {status && <p>{uimsger()}</p>}
        {status === "serverError" && <button onClick={fetcher}>retry</button>}
        
      </>
    );
}

export default UIMsg;