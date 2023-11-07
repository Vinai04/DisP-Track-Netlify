import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateProvider } from "../context/StateContext";
import ReactLoading from "react-loading";
import SuccessTick from "./SuccessTick";

const DeleteContainer = () => {
    const [{ contract }, dispatch] = useStateProvider();

    const [deleteLoad, setDeleteLoad] = useState(false);
    const [tick, setTick] = useState(false);

    const getHandler = async (event) => {
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
    
        setDeleteLoad(true);
        let deleteSuccess;
        try {
          deleteSuccess = await contract.deleteMetadata(
            event.target.documentid.value,
          );
          await deleteSuccess.wait();
          if (deleteSuccess) {
            setDeleteLoad(false);
            setTick(true);
            toast.success("Document Metadata Deleted Sucessfully!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
    
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        } catch (err) {
          toast.error("Deleting Document Metadata Unsucessful", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
    
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      };    

    return (
        <div className="deletedoccontainer">
          <form onSubmit={getHandler}>
            <input
              type="text"
              id="documentid"
              name="documentid"
              placeholder="Document ID"
              className="docidinput"
              style={{marginRight:"0px"}}
            />
    
            {!deleteLoad && !tick && (
              <button type="submit" className="deletedoc-button"
              style={{marginLeft:"60px"}}>
                Delete Document Metadata
              </button>
            )}
    
            <div>
              {deleteLoad && (
                <ReactLoading
                  type={"cubes"}
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
      );
    
}

export default DeleteContainer