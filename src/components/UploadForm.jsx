import { ethers } from "ethers";
import React, { useRef, useState } from "react";
import ReactLoading from "react-loading";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import uuid4 from "uuid4";
import { useStateProvider } from "../context/StateContext";
import "./UploadForm.css";
import SuccessTick from "./SuccessTick";
import { reducerCases } from "../context/Constants";

function UploadForm() {
  let navigate = useNavigate();
  const [{ transaction_status, fileInfo, contract }, dispatch] =
    useStateProvider();
  const [uploadLoad, setUploadLoad] = useState(false);
  const [tick, setTick] = useState(false);

  const [ownedByVal, setOwnedByVal] = useState(null)

  if (fileInfo == undefined) {
    return <Navigate to="/" />;
  }

  const { name, size, owner, type, lastModifiedDate } = fileInfo;

  const fileNameWithoutExtension = name.split(".").slice(0, -1).join(".");

  // Use useRef to store the docid
  const docidRef = useRef(uuid4());

  // Metadata JSON Object
  const metadata = `{
    "Name":"${name}",
    "Size":"${size}",
    "Owner":"${owner}",
    "Type":"${type}",
    "LastModifiedDate":"${lastModifiedDate}",
    "Document ID":"${docidRef.current}"   
  }`;
  console.log(typeof(metadata))

  const parsedMetadata = JSON.parse(metadata);

  let md = "";
  for (const key in parsedMetadata) {
    if (parsedMetadata.hasOwnProperty(key)) {
      md += `${key}: ${parsedMetadata[key]}\n`;
    }
  }

  let confVal = 1;
  function handleConfidentiality(event) {
    confVal = parseInt(event.target.value);
  }

  // Hashing
  const metadataString = JSON.stringify(metadata);
  const hash = ethers.id(metadataString);

  // Upload function parameters
  const _identifier = docidRef.current;
  const _data = {
    Title: String(name),
    data: {
      MetaDataHash: hash,
      Name: String(name),
      Owner: ownedByVal,
      Type: String(type),
      Size: String(size),
      LastModifiedDate: String(lastModifiedDate),
    },
    level: confVal,
  };

  const helperHome = () => {
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (contract === undefined) {
      console.log("Warning");
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
    setUploadLoad(true);
    dispatch({
      type: reducerCases.SET_TRANSACTION_STATUS,
      transaction_status: true,
    });
    try {
      console.log(_data," "+_identifier)
      const tx = await contract.upload(_identifier, _data);
      
      console.log(tx);
      let trans = await tx.wait();
      console.log(trans);
      setUploadLoad(false);
      setTick(true);
      dispatch({
        type: reducerCases.SET_TRANSACTION_STATUS,
        transaction_status: false,
      });
      toast.success("Document Uploaded Successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }),
        setTimeout(helperHome, 3000);
    } catch (err) {
      console.log(err);
      dispatch({
        type: reducerCases.SET_TRANSACTION_STATUS,
        transaction_status: false,
      });
      setUploadLoad(false);
    }
  };

  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    event.preventDefault();
    const el = document.createElement("textarea");
    el.value = docidRef.current;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    toast.info("Document ID Copied", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setCopySuccess(true);
  };

  return (
    <>
      <div className="main">
        <div className="heading--text">
          <h1 className="uploadform_h1">Document Details</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="uploadform">
            <label className="uploadform_label">Title</label>
            <input
              type="text"
              id="documenttitle"
              name="documenttitle"
              placeholder="Document title"
              className="uploadforminput"
              defaultValue={fileNameWithoutExtension}
            />

            <label htmlFor="description" className="uploadform_label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              cols="50"
              className="descriptionbox"
              placeholder="Write about your Document"
            ></textarea>

            <label htmlFor="confidentiality" className="uploadform_label">
              Confidentiality Level
            </label>
            <select
              onChange={handleConfidentiality}
              id="confidentiality"
              name="confidentiality"
            >
              <option value="1">Top Secret</option>
              <option value="2">Secret</option>
              <option value="3">Public</option>
            </select>

            <label className="uploadform_label">Owner</label>
            <input
              type="text"
              id="ownedby"
              name="ownedby"
              placeholder="Who owns the Document?"
              className="uploadforminput"
              onChange={(e)=>setOwnedByVal(e.target.value)}
            />

            <label htmlFor="metadata" className="uploadform_label">
              MetaData
            </label>
            <div>
              <pre className="metadata--pre">{md}</pre>
            </div>

            <label htmlFor="hash" className="uploadform_label">
              Hash of MetaData
            </label>
            <div>
              <pre className="metadata--pre">{hash}</pre>
            </div>
            <label htmlFor="documentID" className="uploadform_label">
              Document ID (Copy the Document ID to retrieve your Document in the
              future)
            </label>
            <div className="metadata--pre doc-id-container">
              <pre>{docidRef.current}</pre>
              <button className="copy-button" onClick={copyToClipboard}>
                <a className="copybutton-anchor">
                  <img src="copyicon_black.svg" className="copy-icon" />
                </a>
              </button>
            </div>
          </div>
          <Tooltip anchorSelect=".copybutton-anchor" place="top">
            Copy Document ID
          </Tooltip>
          <div>
            {!uploadLoad && !tick && (
              <input
                type="submit"
                value="Upload Metadata"
                className="uploadforminput"
              ></input>
            )}
            {uploadLoad && (
              <ReactLoading
                type={"spinningBubbles"}
                color={"#33F8EF"}
                height={100}
                width={100}
                className="loader"
              />
            )}
            {tick && <SuccessTick />}
          </div>
        </form>
      </div>
    </>
  );
}

export default UploadForm;
