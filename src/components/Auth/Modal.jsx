import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../config/firebase.config";
import isEmail from "validator/lib/isEmail";

const avatars = [
  "https://www.shareicon.net/data/128x128/2016/08/18/810211_user_512x512.png",
  "https://www.shareicon.net/data/128x128/2016/08/18/810280_user_512x512.png",
  "https://www.shareicon.net/data/128x128/2016/08/18/810227_user_512x512.png",
  "https://www.shareicon.net/data/128x128/2016/08/18/810281_user_512x512.png",
  "https://www.shareicon.net/data/128x128/2016/09/05/825154_knight_512x512.png",
  "https://www.shareicon.net/data/128x128/2016/08/18/810255_user_512x512.png",
];

const Modal = ({ showModal, setShowModal }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [errors, setErrors] = useState({});
  const validateEmail = (email) => isEmail(email);
  const validatePassword = (password) => password.length >= 6;
  const validateName = (name) => /^[A-Za-z]{2,16}$/.test(name);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = {};

    if (!validateEmail(email)) {
      validationErrors.email = "Invalid email format.";
    }
    if (!validatePassword(password)) {
      validationErrors.password =
        "Password must be at least 6 characters long.";
    }
    if (isSignup) {
      if (!validateName(firstName)) {
        validationErrors.firstName = "First name must be 2-16 letters.";
      }
      if (!validateName(lastName)) {
        validationErrors.lastName = "Last name must be 2-16 letters.";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isSignup) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await sendEmailVerification(user);
        alert(
          "Sign-up successful! Please check your email to verify your account."
        );

        setIsSignup(false);
      } catch (error) {
        alert("Error signing up: " + error.message);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (user.emailVerified) {
          alert("Login successful!");
          setShowModal(false);
        } else {
          alert(
            "Email not verified. Please check your inbox and verify your email before logging in."
          );
          await auth.signOut();
        }
      } catch (error) {
        alert("Error logging in: " + error.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Google login successful!");
      setShowModal(false);
    } catch (error) {
      alert("Error with Google login: " + error.message);
    }
  };

  return (
    <>
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-3xl mx-auto my-6 z-50">
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
                  {isSignup && (
                    <>
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          Choose an Avatar
                        </label>
                        <div className="flex space-x-4">
                          {avatars.map((avatar) => (
                            <img
                              key={avatar}
                              src={avatar}
                              alt="avatar"
                              className={`w-12 h-12 cursor-pointer rounded-full ${
                                selectedAvatar === avatar
                                  ? "border-4 border-blue-500"
                                  : ""
                              }`}
                              onClick={() => setSelectedAvatar(avatar)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your first name"
                          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs italic">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your last name"
                          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs italic">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </>
                  )}

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
                    {errors.email && (
                      <p className="text-red-500 text-xs italic">
                        {errors.email}
                      </p>
                    )}
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
                    {errors.password && (
                      <p className="text-red-500 text-xs italic">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    >
                      {isSignup ? "Sign Up" : "Login"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSignup(!isSignup)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {isSignup
                        ? "Already have an account? Login"
                        : "Don't have an account? Sign Up"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
