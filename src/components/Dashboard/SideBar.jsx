import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useUserContext } from "../../Context/UserContext";

function SideBar({ setActBtn }) {
  const { user } = useUserContext();
  const [key, setKey] = useState(0);

  // Effect to update the key whenever the user changes
  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [user]);

  return (
    <React.Fragment key={key}>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="mb-3">
          <Container fluid>
            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand-${expand}`}
              style={{ fontSize: "13px" }}
            />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  {user.name}
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-start flex-grow-1 pe-3">
                  <button
                    className="btn btn-outline-dark mb-2 Subject"
                    onClick={() => {
                      setActBtn("DASHBOARD");
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="btn btn-outline-dark mb-2 Subject"
                    onClick={() => {
                      setActBtn("CUSTOM SETS");
                    }}
                  >
                    Create custom sets
                  </button>
                  <button
                    className="btn btn-outline-dark mb-2 Subject"
                    onClick={() => {
                      setActBtn("UPDATE PROFILE");
                    }}
                  >
                    Update user Profile
                  </button>

                  {user && user.login_type === "partner" ? (
                    <button
                      className="btn btn-outline-dark mb-2 Subject"
                      onClick={() => {
                        setActBtn("ADD VIDEOS");
                      }}
                    >
                      Add Videos
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-dark mb-2 Subject"
                      onClick={() => {
                        setActBtn("BECOME YOUTUBE PARTNER");
                      }}
                    >
                      Want to add Videos
                    </button>
                  )}
                  <NavDropdown
                    title="Dropdown"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                  >
                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Something else here
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </React.Fragment>
  );
}

export default SideBar;
