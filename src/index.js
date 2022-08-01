import React from "react";
import ReactDOM from "react-dom/client";
import Container from "react-bootstrap/Container";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  return (
    <Container fluid>
      <Header />
      <Content />
      <br /><br />
      <Footer />
    </Container>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);