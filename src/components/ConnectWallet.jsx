import { ethers } from "ethers";
import { useState } from "react";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import { reducerCases } from "../context/Constants";
import { useStateProvider } from "../context/StateContext";
import DisPTrack_abi from "../contracts/DisPTrack_abi.json";

function ConnectWallet() {
  const contractAddress = "0xE1a93700e6957E3d3F649CDB5a485383Ea0cc17B";

  const [{}, dispatch] = useStateProvider();
  const [dotLoader, setDotLoader] = useState(false);

  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [connectWallet, setConnectWallet] = useState("nav--connect");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  let accountText = 0;

  const buttonState = () => {
    updateEthers();
    setConnectWallet(true);
    setButtonText(accountText);
    setDotLoader(false);
    setConnectWallet("nav--connected");
    toast.success("Wallet Connected Successfully", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  async function connectToMetaMask() {
    if (contract != undefined) {
      return;
    }

    setDotLoader(true);
    if (window.ethereum) {
      try {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(account);
        accountText =
          account[0].slice(0, 6) +
          "..." +
          account[0].slice(account[0].length - 4, account[0].length);
        setButtonText("");

        setConnectWallet("nav--connecting");

        await setTimeout(buttonState, 3000);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask not detected. Please install it.");
    }
  }

  const updateEthers = async () => {
    let tempProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = await tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(
      contractAddress,
      DisPTrack_abi,
      tempSigner
    );

    dispatch({
      type: reducerCases.SET_CONTRACT,
      contract: tempContract,
    });
    setContract(tempContract);
  };

  return (
    <>
      <button className={connectWallet} onClick={connectToMetaMask}>
        {dotLoader && (
          <ReactLoading
            type={"bubbles"}
            color={"black"}
            height={25}
            width={25}
            className="nav--loader"
          />
        )}
        {!dotLoader && (
          <img src="connecticon_black.png" className="nav--connect_icon" />
        )}
        {buttonText}
      </button>
    </>
  );
}

export default ConnectWallet;
