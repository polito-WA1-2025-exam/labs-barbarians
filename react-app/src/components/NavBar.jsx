import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function NavBar({ username, setUser, setShowProfile }) {
  const handleLogout = () => {
    setUser(null);
  };

  const handleProfileClick = () => {
    setShowProfile(true); // Show the profile popup
  };

  return (
    <Navbar expand="lg" className="fixed-top bg-primary">
      <Container>
        <Navbar.Brand href="#home" className="text-white">
          PokeBowl App
        </Navbar.Brand>
        <Nav className="me-auto">
          {username && (
            <Nav.Link href="#OrderHistory" className="text-white">
              Order History
            </Nav.Link>
          )}
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {username ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-user"
                  className="text-decoration-none"
                  style={{ color: 'white', fontSize: '1.5rem' }}
                >
                  <i className="bi bi-person"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleProfileClick}>Profile</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <a href="#login" title="Login" className="text-white">
                <i
                  className="bi bi-box-arrow-in-left"
                  style={{ fontSize: '1.5rem' }}
                ></i>
              </a>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;