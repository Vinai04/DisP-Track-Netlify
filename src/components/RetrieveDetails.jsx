import React, { useState } from "react";
import ReactLoading from "react-loading";
import { Navigate } from "react-router";
import { useStateProvider } from "../context/StateContext";
import "./RetrieveDetails.css";

function RetrieveDetails() {
  const [loader, setLoader] = useState(true);

  setTimeout(alertAfter3Seconds, 1500);
  function alertAfter3Seconds() {
    setLoader(false);
  }

  const [{ redirect_page, retrieved_data }, dispatch] = useStateProvider();

  console.log("In Retrieve Details", retrieved_data);
  if (redirect_page == false) {
    return (
      <>
        <Navigate to={"/"}></Navigate>
      </>
    );
  }

  return (
    <div className="retrievedoc-main">
      <div className="retrievedoc-container">
        {loader && (
          <ReactLoading
            type={"spin"}
            color={"#4fff55"}
            height={300}
            width={100}
            className="loader"
          />
        )}

        {!loader && (
          <>
            <h1 className="retrievedDocDet_h1">Retrieved Document Details</h1>
            <div className="retrievedoc-container">
              <pre className="retrievedDocDet--pre">
                Name: {retrieved_data.data[1]}
                <br></br>
                Size: {retrieved_data.data[4]} bytes
                <br></br>
                Owner: {retrieved_data.data[2]}
                <br></br>
                Type: {retrieved_data.data[3]}
                <br></br>
                LastModifiedDate: {String(retrieved_data.data[5])}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RetrieveDetails;
