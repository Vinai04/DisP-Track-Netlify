import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateProvider } from "../context/StateContext";
import ReactLoading from "react-loading";
import SuccessTick from "./SuccessTick";

function AddNewOwnerContainer() {
  const [{ contract }, dispatch] = useStateProvider();

  const [addNewOwnerLoad, setAddNewOwnerLoad] = useState(false);
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

    if (event.target.addnewowner.value === "") {
      toast.warn("New Owner field required", {
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

    setAddNewOwnerLoad(true);
    let addNewOwnerSuccess;
    try {
      addNewOwnerSuccess = await contract.addNewOwner(
        event.target.documentid.value,
        event.target.addnewowner.value
      );
      await addNewOwnerSuccess.wait();
      if (addNewOwnerSuccess) {
        setAddNewOwnerLoad(false);
        setTick(true);
        toast.success("New Owner added Sucessfully!", {
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
      toast.error("Adding new Owner Unsucessful", {
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
    <div className="addnewownercontainer">
      <form onSubmit={getHandler}>
        <input
          type="text"
          id="documentid"
          name="documentid"
          placeholder="Document ID"
          className="docidinput"
        />

        <input
          type="text"
          id="addnewowner"
          name="addnewowner"
          placeholder="Who is the New Owner?"
          className="addnewownerinput"
        />

        {!addNewOwnerLoad && !tick && (
          <button type="submit" className="addnewowner-button">
            Add New Owner
          </button>
        )}

        <div>
          {addNewOwnerLoad && (
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

export default AddNewOwnerContainer;
