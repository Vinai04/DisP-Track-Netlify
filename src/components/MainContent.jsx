import React from "react";
import "../App.css";
import RetrieveContainer from "./RetrieveContainer";
import UploadContainer from "./UploadContainer";
import TransferOwnerContainer from "./TransferOwnerContainer";
import AddNewOwnerContainer from "./AddNewOwnerContainer";

function MainContent() {
  return (
    <div className="main">
      <div className="heading--text">
        <h1 className="upload-container_h1">
          Unleash the Power of <b>DisP-Track</b> for Document Integrity!
        </h1>
      </div>
      <UploadContainer />
      <p className="description">
        Supported file types: pdf, txt, doc, ppt, xls, docx, and more
      </p>
      <p className="description">
        By uploading, you agree to our{" "}
        <a href="" className="links">
          <u>DisP-Track Uploader Agreement</u>
        </a>
        .
      </p>
      <br />
      <p className="description">
        You must own the copyright to any document you upload on DisP-Track. You
        can read more about this in our{" "}
        <a href="" className="links">
          <u>Copyright FAQs</u>
        </a>
        .
      </p>
      <br />
      <br />
      <div className="heading--text">
        <h1 className="retrieve-container_h1">
          Retrieve Document metadata by providing it's unique Document ID
        </h1>
      </div>
      <RetrieveContainer />
      <br />
      <div className="heading--text">
        <h1 className="transowner-container_h1">
          Transfer Ownership of the Document by providing it's unique Document ID
        </h1>
      </div>
      <TransferOwnerContainer />
      <br />
      <div className="heading--text">
        <h1 className="transowner-container_h1">
          Add a new Owner for the Document by providing it's unique Document ID
        </h1>
      </div>
      <AddNewOwnerContainer />
    </div>
  );
}

export default MainContent;
