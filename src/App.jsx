import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./containers/WelcomePage";
import AccountPage from "./containers/AccountPage";
import CreateExhibitionPage from "./containers/CreateExhibitionPage";
import Modal from "./components/Auth/Modal";
import Navbar from "./components/Navbar";
import ArtItem from "./containers/ArtItem"

function App() {
  const [showModal, setShowModal] = useState(true);

  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/create-exhibition" element={<CreateExhibitionPage />} />
        <Route path="/artwork/:id" element={<ArtItem />} />
        <Route
          path="/login"
          element={<Modal showModal={showModal} setShowModal={setShowModal} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
