import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./containers/WelcomePage";
import AccountPage from "./containers/AccountPage";
import CreateExhibitionPage from "./containers/CreateExhibitionPage";
import Modal from "./components/Auth/Modal";
import Navbar from "./components/Navbar";
import ArtItem from "./containers/ArtItem";
import MyExhibitions from "./components/MyExhibitions";
import AllExhibitions from "./components/AllExhibitions";
import ExhibitionEdit from "./components/ExhibitionEdit";
import ExhibitionView from "./components/ExhibitionView";
import ExhibitionViewV2 from "./components/ExhibitionViewV2";

function App() {
  const [showModal, setShowModal] = useState(true);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/account/:id" element={<AccountPage />} />
        <Route path="/create-exhibition" element={<CreateExhibitionPage />} />
        <Route path="/artwork/:id" element={<ArtItem />} />
        <Route
          path="/login"
          element={<Modal showModal={showModal} setShowModal={setShowModal} />}
        />
        <Route path="/my-exhibitions/:id" element={<MyExhibitions />} />
        <Route path="/all-exhibitions" element={<AllExhibitions />} />
        <Route path="/exhibition-edit/:id" element={<ExhibitionEdit />} />
        <Route path="/exhibition-view/:id" element={<ExhibitionView />} />
        <Route path="/exhibition-viewV2/:id" element={<ExhibitionViewV2 />} />
      </Routes>
    </Router>
  );
}

export default App;
