import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './DemoFormModal.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';
import { validateField } from '../validation/validate';
import { requestOtp, verifyOtp, createUser } from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DemoFormModal = ({ show, handleClose, onResetRef }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpWarning, setOtpWarning] = useState('');
  const [otpError, setOtpError] = useState('');

  // Reset form function
  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setOtp('');
    setErrors({});
    setTouched({});
    setIsOtpRequested(false);
    setSuccessMessage('');
    setIsVerified(false); 
    setIsSubmitting(false);
    setOtpWarning('');
    setOtpError('');
  };

  useEffect(() => {
    if (onResetRef) {
      onResetRef.current = resetForm; 
    }
  }, [onResetRef]);

  const handleFocus = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleValidation = (field, value) => {
    const error = validateField(field, value, touched[field]);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const touchedFields = { name: true, email: true, phone: true, otp: true };
    setTouched(touchedFields);
  
    handleValidation('name', name);
    handleValidation('email', email);
    handleValidation('phone', phone);
    handleValidation('otp', otp);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    if (!isVerified) {
      setOtpWarning('Please verify the OTP before submitting.');
      setTimeout(() => setOtpWarning(''), 4000); 
      return;
    }
  
    const userData = { name, email, phone, message };
    setIsSubmitting(true);
    setTimeout(async () => {
      try {
        const response = await createUser(userData);
        if (response.success) {
          toast.success(response.message);
          if (onResetRef.current) {
            onResetRef.current(); 
          }
          setTimeout(() => {
            handleClose();
          }, 4000);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        setErrors((prevErrors) => ({ ...prevErrors, submit: error.message }));
        toast.error(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }, 2000);
  };
  

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleGetOtp = async () => {
    if (!name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: 'Name is required' }));
      return;
    }
    setIsSendingOtp(true);

    try {
      const response = await requestOtp(name, email);
      setSuccessMessage(response.message);
      setIsOtpRequested(true);
      toast.success(response.message); 
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, email: error.message || 'Error sending OTP' }));
      toast.error(error.message || 'Error sending OTP'); 
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrors((prevErrors) => ({ ...prevErrors, otp: 'Please enter the OTP.' }));
      return;
    }
    setIsVerifyingOtp(true);

    try {
      const response = await verifyOtp(email, otp);
      if (response.success) {
        if (response.data?.verified) {
          setSuccessMessage(response.message);
          setIsVerified(true);
          toast.success(response.message);
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, otp: response.message }));
          toast.error(response.message);
        }
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, otp: response.message }));
        toast.error(response.message);
      }
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, otp: error.message || 'Error verifying OTP' }));
      toast.error(error.message || 'Error verifying OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <Modal size="lg" show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="text-center modal-head">
              👋🏻 Let’s get started! Excited to begin this journey with you.
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={submit} className="demoform-body">
            <div className="mb-3 d-flex gap-4">
              <TextField
                id="name"
                label="Enter Your Name *"
                variant="outlined"
                fullWidth
                value={name}
                onFocus={() => handleFocus('name')}
                onChange={(e) => {
                  setName(e.target.value);
                  handleValidation('name', e.target.value);
                }}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                id="phone"
                label="Enter Mobile Number *"
                variant="outlined"
                fullWidth
                value={phone}
                inputProps={{ maxLength: 10 }}
                onFocus={() => handleFocus('phone')}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setPhone(e.target.value);
                  handleValidation('phone', e.target.value);
                }}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </div>
            <div className="mb-3">
              <TextField
                id="email"
                label="Enter Work Email *"
                variant="outlined"
                fullWidth
                value={email}
                disabled={isVerified}
                onFocus={() => handleFocus('email')}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleValidation('email', e.target.value);
                  setSuccessMessage('');
                }}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  endAdornment: isVerified ? (
                    <CheckCircleOutlineIcon color="success" />
                  ) : (
                    isValidEmail(email) && (
                      <InputAdornment position="end">
                        <Button
                          className="getotp-btn"
                          variant="outlined"
                          size="small"
                          onClick={handleGetOtp}
                        >
                          {isSendingOtp ? 'Sending...' : 'Get OTP'}
                        </Button>
                      </InputAdornment>
                    )
                  ),
                }}
              />
            </div>
            {successMessage && <p className="success-message">{successMessage}</p>}
            
            {!isVerified && isOtpRequested && (
              <div className="mb-3">
                <TextField
                  id="otp"
                  label="Enter OTP"
                  variant="outlined"
                  fullWidth
                  value={otp}
                  onFocus={() => handleFocus('otp')}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    handleValidation('otp', e.target.value);
                  }}
                  error={!!errors.otp}
                  helperText={errors.otp}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          className="verifyotp-btn"
                          variant="outlined"
                          size="small"
                          onClick={handleVerifyOtp}
                        >
                          {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            )}
            <div className="mb-3">
              <TextField
                id="message"
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={message}
                onFocus={() => handleFocus('message')}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                error={!!errors.message}
                helperText={errors.message}
              />
            </div>
            {otpWarning && (
              <p className="otp-warning">{otpWarning}</p>
            )}
            <div className="text-center">
              {/* <Button type="submit" variant="contained" color="primary" className="submit-btn demo-btn" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}>
                {isSubmitting ? 'Submitting...' : 'Book A Demo'}
              </Button> */}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
                className="submit-btn demo-btn"
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Book A Demo'
                )}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DemoFormModal;