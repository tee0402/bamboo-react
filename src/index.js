import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import "./index.css";

function App() {
  return (
    <div className="container-fluid">
      <Header />
      <Content />
      <br /><br />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);