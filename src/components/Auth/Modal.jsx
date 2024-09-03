import React, { useState } from "react";
import { auth } from "../../config/firebase.config";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const Modal = ({ showModal, setShowModal }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await sendEmailVerification(user);
        setFeedback(
          "Registration successful! Please check your email to verify your account."
        );
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (user.emailVerified) {
          setShowModal(false);
          navigate("/account");
        } else {
          setFeedback(
            "Email not verified. Please check your inbox and verify your email."
          );
        }
      }
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-3xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                <h3 className="text-3xl font-semibold">
                  {isSignup ? "Sign Up" : "Login"}
                </h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative flex-auto p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {feedback && (
                    <p className="text-red-500 text-xs italic">{feedback}</p>
                  )}

                  <div className="mb-6 text-center">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                      disabled={loading}
                    >
                      {loading
                        ? "Please wait..."
                        : isSignup
                        ? "Sign Up"
                        : "Login"}
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex items-center justify-center p-6 border-t border-solid rounded-b border-slate-200">
                <button
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup
                    ? "Already have an account? Login here."
                    : "Don't have an account? Sign up here."}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
