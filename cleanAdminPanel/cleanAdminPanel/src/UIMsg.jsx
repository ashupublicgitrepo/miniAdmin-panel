import React from "react";

const UIMsg = ({ status, fetcher }) => {
   
    const msgMapper = {
      load: "...loading",
      serverError: "internal server error. Please try again.",
      userNotFound: "searched user not found, please check initials."
    };

    function uimsger() {
        return msgMapper[status];
    }
    return (
      <>
        {status && <p>{uimsger()}</p>}
        {status==="serverError" && <button onClick={fetcher}>retry</button>}
      </>
    );
}

export default UIMsg;