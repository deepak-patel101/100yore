import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  return (
    <div className="container papaDiv">
      <div className="row">
        <div className="col text-center">
          <h5>What is in your mind???</h5>
        </div>
      </div>
    </div>
  );
}

export default Header;
