import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { reducerCases } from "../context/Constants";
import { useStateProvider } from "../context/StateContext";

function RetrieveContainer() {
  const [{contract}, dispatch] =
    useStateProvider();

  const [redir, setRedir] = useState(false);

  useEffect(() => {
    dispatch({ type: reducerCases.SET_REDIRECT, redirect_page: false });
  }, []);

  const getHandler = async (event) => {
    event.preventDefault();

    if (contract === undefined) {
      console.log("Warning123");
      toast.warn("Wallet not connected", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    if (event.target.documentid.value === "") {
      toast.warn("Document ID required", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    console.log(event.target.documentid.value);
    let retrieved_data = await contract.retrieveData(
      event.target.documentid.value
    );
    console.log("contractValue=", retrieved_data);
    dispatch({
      type: reducerCases.SET_RETRIEVED_DATA,
      retrieved_data: retrieved_data,
    });
    dispatch({ type: reducerCases.SET_REDIRECT, redirect_page: true });
    setRedir(true);
  };

  return (
    <div className="retrievecontainer">
      {redir && <Navigate to="/retrieve"></Navigate>}
      <form onSubmit={getHandler}>
        <input
          type="text"
          id="documentid"
          name="documentid"
          placeholder="Document ID"
          className="docidinput"
        />
        <button type="submit" className="retrieve-button">
          Retrieve Document
        </button>
      </form>
    </div>
  );
}

export default RetrieveContainer;
