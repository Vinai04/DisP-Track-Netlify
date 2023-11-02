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

  const [confLevel, setConfLevel] = useState(0);
  const [description, setDescription] = useState("");

  if (fileInfo == undefined) {
    return <Navigate to="/" />;
  }

  const { name, size, owner, type, lastModifiedDate } = fileInfo;

  const fileNameWithoutExtension = name.split(".").slice(0, -1).join(".");

  const docidRef = useRef(uuid4());

  const printMetadata = `{
    "Title":"${fileNameWithoutExtension}",
    "Size":"${size}",
    "Type":"${type}",
    "LastModifiedDate":"${lastModifiedDate}",
    "Document ID":"${docidRef.current}"   
  }`;

  const parsedMetadata = JSON.parse(printMetadata);

  let md = "";
  for (const key in parsedMetadata) {
    if (parsedMetadata.hasOwnProperty(key)) {
      md += `${key}: ${parsedMetadata[key]}\n`;
    }
  }

  const hashMetadata = `{
    "Title":"${fileNameWithoutExtension}",
    "Description":"${description}",
    "Confidentiality Level":"${confLevel}",
    "Type":"${type}",
    "Size":"${size}",
    "LastModifiedDate":"${lastModifiedDate}",
    "Document ID":"${docidRef.current}"   
  }`;

  const metadataString = JSON.stringify(hashMetadata);
  const hash = ethers.id(metadataString);

  function handleConfidentiality(event) {
    setConfLevel(parseInt(event.target.value));
  }

  function handleDescription(event) {
    setDescription(event.target.value);
  }

  const _identifier = docidRef.current;
  let _data = {
    Title: String(name),
    Description: description,
    level: confLevel,
    ownerList: [],
    Type: String(type),
    Size: String(size),
    LastModifiedDate: String(lastModifiedDate),
    MetaDataHash: hash,
  };

  const helperHome = () => {
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (contract === undefined) {
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
      const tx = await contract.upload(_identifier, _data);

      let trans = await tx.wait();
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
      dispatch({
        type: reducerCases.SET_TRANSACTION_STATUS,
        transaction_status: false,
      });
      setUploadLoad(false);
    }
  };

  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = (event) => {
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
              onChange={handleDescription}
              value={description}
            ></textarea>

            <label htmlFor="confidentiality" className="uploadform_label">
              Confidentiality Level
            </label>
            <select
              onChange={handleConfidentiality}
              id="confidentiality"
              name="confidentiality"
              value={confLevel}
            >
              <option value="0">Top Secret</option>
              <option value="1">Secret</option>
              <option value="2">Public</option>
            </select>

            <label htmlFor="printMetadata" className="uploadform_label">
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
