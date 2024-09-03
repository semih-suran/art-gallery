import React from "react";
import { useNavigate } from "react-router-dom";

function AccountPage() {
  const navigate = useNavigate();

  const handleCreateExhibition = () => {
    navigate("/create-exhibition");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <div className="space-y-6 w-full max-w-md">
        {" "}
        <button
          onClick={handleCreateExhibition}
          className="w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          Create New Exhibition
        </button>
        <div className="border rounded-lg p-4">
          <h2 className="text-2xl font-semibold">Your Exhibitions</h2>
          <p>No exhibitions created yet.</p>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
