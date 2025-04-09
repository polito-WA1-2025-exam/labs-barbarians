import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ProfileModal({ show, onHide, username, onDeleteProfile }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="text-center">{username}</h5>
        <p className="text-center">Manage your account settings below.</p>
        <div className="d-flex justify-content-center">
          <Button variant="danger" onClick={onDeleteProfile}>
          Delete user <i class="bi bi-person-x"></i>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ProfileModal;