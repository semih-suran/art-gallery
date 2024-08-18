import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex justify-center items-center">
        <a href="https://github.com/semih-suran" target="_blank">
          <img src="./art.svg" alt="art logo" className="w-16 h-16" />
        </a>
      </div>
      <h1>Art Gallery</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the logo to learn more</p>
    </>
  );
}

export default App;
