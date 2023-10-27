import { useNavigate } from "react-router-dom";
import "../App.css";
import ConnectWallet from "./ConnectWallet";
import { useStateProvider } from "../context/StateContext";
import { toast } from "react-toastify";

function Navbar() {
  const [{ transaction_status }, dispatch] = useStateProvider();
  let navigate = useNavigate();
  const handleClick = () => {
    if (transaction_status == false) {
      navigate("/");
    } else {
      toast.warning("Transaction in progress", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <div className="nav">
        <button className="home-button" onClick={handleClick}>
          <img src="disptrackLogo.svg" className="nav--logo" />
        </button>
        <div className="nav--buttons">
          <ConnectWallet />
          {/*<a href=""><img src="profile.png" className="nav--profile"/></a>*/}
        </div>
      </div>
    </>
  );
}

export default Navbar;
