import React from "react";

const FakeUsers = () => {
     const fakeStyles = {
       backgroundColor: "rgba(211, 211, 211)",
       width: "100%",
       height: "30px",
       margin: "5px",
       borderRadius: "5px",
    };
    const fakeUser = [];
    for (let x = 0; x < 10; x++) {
      fakeUser.push(x);
    }
    return (
      <>
        {
          fakeUser.map((u) => <div key={u} style={fakeStyles}></div>)}
      </>
    );
}
export default FakeUsers;