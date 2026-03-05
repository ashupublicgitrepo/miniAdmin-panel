import React from "react";
const Form = ({ taskAdder, data, dataSetter, disable }) => {
   
    return (
      <>
        <form  action="" onSubmit={(e) => taskAdder(e)}>
          <input type="text" value={data} onChange={dataSetter} />
          <button disabled={disable === "loading"}>{disable === "loading" ? "...adding" : "add task"}</button>
        </form>
      </>
    );
}
export default Form;