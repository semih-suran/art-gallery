import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../config/firebase.config";
import isEmail from "validator/lib/isEmail";
import { registerUser } from "../../services/api";

const avatars = [
  "https://www.shareicon.net/data/128x128/2016/05/24/770089_people_512x512.png",
  "https://www.shareicon.net/data/128x128/2016/05/24/770104_man_512x512.png",
  "https://www.shareicon.net/data/128x128/2016/05/24/770107_man_512x512.png",
  "https://www.shareicon.net/data/128x128/2016/09/05/825154_knight_512x512.png",
  "https://www.shareicon.net/data/128x128/2016/05/24/770093_people_512x512.png",
  "https://www.shareicon.net/data/128x128/2016/05/24/770092_people_512x512.png",
];

const Modal = ({ showModal, setShowModal }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const validateEmail = (email) => isEmail(email);

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z]{2,16}$/;
    return nameRegex.test(name);
  };

  const validateNickname = (nickname) => {
    const nicknameRegex = /^[A-Za-z0-9_!@#$%^&*]{2,16}$/;
    return nicknameRegex.test(nickname);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^.{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSignup) {
      if (!validateName(first_name)) {
        alert("First name should be between 2 to 16 letters only.");
        return;
      }
      if (!validateName(last_name)) {
        alert("Last name should be between 2 to 16 letters only.");
        return;
      }
      if (!validateNickname(nickname)) {
        alert("Nickname should be between 2 to 16 characters.");
        return;
      }
      if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }
      if (!validatePassword(password)) {
        alert("Password must be at least 6 characters long.");
        return;
      }

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
        const userData = {
          first_name,
          last_name,
          nickname,
          email,
          verified: true,
          password,
          picture: selectedAvatar,
          mobile_phone: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        };
        try {
          await registerUser(userData);
          alert(
            "Registration successful! Please log in after verifying your email."
          );
          setIsSignup(false);
        } catch (backendError) {
          console.error("Error saving user data to backend:", backendError);
          alert("Failed to save user data to the backend. Please try again.");
        }
      } catch (firebaseError) {
        alert("Error signing up: " + firebaseError.message);
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
      } catch (loginError) {
        alert("Error logging in: " + loginError.message);
      }
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
                          value={first_name}
                          onChange={(e) => setFirst_name(e.target.value)}
                        />
                        {!validateName(first_name) && first_name && (
                          <p className="text-red-500 text-xs italic">
                            First name should be between 2 to 16 letters only..
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
                          value={last_name}
                          onChange={(e) => setLast_name(e.target.value)}
                        />
                        {!validateName(last_name) && last_name && (
                          <p className="text-red-500 text-xs italic">
                            Last name should be between 2 to 16 letters only.
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          className="block mb-2 text-sm font-bold text-gray-700"
                          htmlFor="nickname"
                        >
                          Nickname
                        </label>
                        <input
                          type="text"
                          id="nickname"
                          placeholder="Enter your nickname"
                          className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                            !validateNickname(nickname) && nickname
                              ? "border-red-500"
                              : ""
                          }`}
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                        />
                        {!validateNickname(nickname) && nickname && (
                          <p className="text-red-500 text-xs italic">
                            Nickname should be between 2 to 16 characters.
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
                    {!validateEmail(email) && email && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a valid email address.
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
                    {!validatePassword(password) && password && (
                      <p className="text-red-500 text-xs italic">
                        Password must be at least 6 characters long.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    >
                      {isSignup ? "Sign Up" : "Login"}
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
      ) : null}
    </>
  );
};

export default Modal;
