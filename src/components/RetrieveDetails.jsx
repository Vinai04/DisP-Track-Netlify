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

  if (redirect_page == false) {
    return (
      <>
        <Navigate to={"/"}></Navigate>
      </>
    );
  }

  const fileNameWithoutExtension = retrieved_data[0]
    .split(".")
    .slice(0, -1)
    .join(".");

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

        {!loader && Object.keys(retrieved_data[3]).length===0 && (
        <h1 style={{color:"white"}}>This Document was deleted!</h1>
        )}

        {!loader && Object.keys(retrieved_data[3]).length!==0 && (
          <>
            <h1 className="retrievedDocDet_h1">Retrieved Document Details</h1>
            <div>
              <pre className="retrievedDocDet--pre">
                <b>Title:</b> {fileNameWithoutExtension}
                <br></br>
                <b>Description:</b> {retrieved_data[1]}
                <br></br>
                <b>Confidentiality Level:</b> {String(retrieved_data[2])}
                <br></br>
                <b>Number of Owners:</b> {Object.keys(retrieved_data[3]).length}
                <br></br>
                <b>Owner(s):</b> {retrieved_data[3].join(", ")}
                <br></br>
                <b>Type:</b> {retrieved_data[4]}
                <br></br>
                <b>Size:</b> {retrieved_data[5]} bytes
                <br></br>
                <b>LastModifiedDate:</b> {String(retrieved_data[6])}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RetrieveDetails;
