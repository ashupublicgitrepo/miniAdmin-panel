import React from "react";

const Search = ({input, inputSetter, phase}) => {
    
    return (
      <>
        {phase ==="idle" && (<div>
          <form action="" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search">search user </label>
            <input
              type="text"
              onChange={(e) => inputSetter(e)}
              value={input}
              id="search"
              name="searchBox"
            />
          </form>
        </div>)}
      </>
    );
}
export default Search;