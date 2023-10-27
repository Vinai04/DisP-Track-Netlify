import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import Navbar from "./components/Navbar";
import RetrieveDetails from "./components/RetrieveDetails";
import UploadForm from "./components/UploadForm";
import { StateProvider } from "./context/StateContext";
import reducer, { initialState } from "./context/StateReducer";

function App() {
  return (
    <>
      <div className="mainApp">
        <StateProvider initialState={initialState} reducer={reducer}>
          <ToastContainer />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<MainContent />}></Route>
              <Route path="/upload" element={<UploadForm />}></Route>
              <Route path="/retrieve" element={<RetrieveDetails />}></Route>
              <Route path="*" element={<Navigate to="/" />}></Route>
            </Routes>
          </BrowserRouter>
        </StateProvider>
        <Footer />
      </div>
    </>
  );
}

export default App;
