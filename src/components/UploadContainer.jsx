import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { reducerCases } from "../context/Constants";
import { useStateProvider } from "../context/StateContext";

function UploadContainer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [{ fileInfo }, dispatch] = useStateProvider(undefined);

  useEffect(() => {
    dispatch({
      type: reducerCases.SET_FILE_DATA,
      fileInfo: undefined,
    });
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      dispatch({
        type: reducerCases.SET_FILE_DATA,
        fileInfo: file,
      });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);

      dispatch({
        type: reducerCases.SET_FILE_DATA,
        fileInfo: file,
      });
    }
  };

  const handleDragOver = (event) => {
    // console.log(event)
    event.preventDefault();
    setIsDragging(true);
  };
  const handleDragOverLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const containerClassName = isDragging
    ? "upload-container_dark"
    : "upload-container";

  return (
    <>
      {selectedFile && <Navigate to="/upload"></Navigate>}

      <div
        className={containerClassName}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragOverLeave}
      >
        <input
          type="file"
          accept=".pdf, .txt, .doc, .ppt, .xls, .docx"
          style={{ display: "none" }}
          onChange={handleFileChange}
          id="fileInput"
        />
        <label htmlFor="fileInput" className="upload-button">
          Select Document To Upload
        </label>
        <p className="dd">or drag & drop</p>
      </div>
    </>
  );
}

export default UploadContainer;
