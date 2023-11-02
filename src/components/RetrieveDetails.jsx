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

  const fileNameWithoutExtension = retrieved_data[0].split(".").slice(0, -1).join(".");

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
                Title: {fileNameWithoutExtension}
                <br></br>
                Description: {retrieved_data[1]}
                <br></br>
                Confidentiality Level: {String(retrieved_data[2])}
                <br></br>
                Number of Owners: {Object.keys(retrieved_data[3]).length}
                <br></br>
                Owner: {retrieved_data[3]}
                <br></br>
                Type: {retrieved_data[4]}
                <br></br>
                Size: {retrieved_data[5]} bytes
                <br></br>
                LastModifiedDate: {String(retrieved_data[6])}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RetrieveDetails;
