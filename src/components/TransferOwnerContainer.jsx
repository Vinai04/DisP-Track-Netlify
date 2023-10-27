import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateProvider } from "../context/StateContext";
import ReactLoading from "react-loading";
import SuccessTick from "./SuccessTick";

function TransferOwnerContainer() {
    const [{contract}, dispatch] =
    useStateProvider();

  const [transferLoad, setTransferLoad] = useState(false);
  const [tick, setTick] = useState(false);

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

        if (event.target.transowner.value === "") {
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

          setTransferLoad(true);
          let transOwnerSuccess
          try {
              transOwnerSuccess = await contract.transferOwnerShip(
              event.target.documentid.value,
              event.target.transowner.value
            );
            await transOwnerSuccess.wait();
            if(transOwnerSuccess){
              setTransferLoad(false);
              setTick(true);
              toast.success("Ownership Transferred Sucessfully!", {
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
          }
          catch (err) {
            console.log(err);
            toast.error("Transferring Ownership Unsucessful", {
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
    <div className="transownercontainer">
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
          id="transowner"
          name="transowner"
          placeholder="Who is the New Owner?"
          className="transownerinput"
        />
        
        {!transferLoad && !tick && (
        <button type="submit" className="transowner-button">
          Transfer Ownership
        </button>
        )}

        <div>
            {transferLoad && (
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

export default TransferOwnerContainer;
