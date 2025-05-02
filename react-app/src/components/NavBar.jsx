import React from 'react';
import { Link } from 'react-router-dom';
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
        <Navbar.Brand as={Link} to="/" className="text-white">
          Create PokéBowl
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
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
                  <Dropdown.Item as={Link} to="/past-orders">
                    Past Orders
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/order">
                    Order
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link to="/login" title="Login" className="text-white">
                <i
                  className="bi bi-box-arrow-in-left"
                  style={{ fontSize: '1.5rem' }}
                ></i>
              </Link>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;