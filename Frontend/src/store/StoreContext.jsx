import React, { createContext, useState } from "react";

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loggedInUserType, setLoggedInUserType] = useState(null);
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState("")

  return (
    <StoreContext.Provider
      value={{
        name,
        setName,
        balance,
        setBalance,
        loggedInUserType,
        setLoggedInUserType,
        currPage,
        setCurrPage,
        totalPages,
        setTotalPages,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
