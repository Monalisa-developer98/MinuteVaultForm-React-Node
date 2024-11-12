import React, { useState, useRef } from 'react';
import './demoForm.css';
import { Button } from 'react-bootstrap';
import DemoFormModal from '../modals/DemoFormModal';

const DemoForm = () => {
  const [showModal, setShowModal] = useState(false);
  const formResetRef = useRef(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    if (formResetRef.current) formResetRef.current(); // Reset form fields
  };

  return (
    <div className='container d-flex justify-content-center align-items-center form-container'>
      <Button variant="primary" className='demo-btn' onClick={handleShow}>
        Book A Demo
      </Button>

      {/* Modal Component */}
      <DemoFormModal show={showModal} handleClose={handleClose} onResetRef={formResetRef} />
    </div>
  );
}

export default DemoForm;
