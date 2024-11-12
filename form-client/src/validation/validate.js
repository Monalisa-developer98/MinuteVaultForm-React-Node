
// validation function 

export const validateField = (fieldName, value, isFocused) => {
  let error = '';

  switch (fieldName) {
    case 'name':
      if (!value.trim() && isFocused) {
        error = 'Name is required.';
      } else if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = 'Invalid character.';
      } else if (value.length < 3) {
        error = 'Minimum 3 characters required';
      }
      break;
    case 'phone':
      if (!value.trim() && isFocused) {
        error = 'Phone number is required.';
      } else if (!/^[0-9]*$/.test(value)) {
        error = 'Invalid character';
      } else if (value.length !== 10) {
        error = 'Please enter a valid mobile number';
      }
      break;
    case 'email':
      if (!value.trim() && isFocused) {
        error = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address.';
      }
      break;
    case 'message':
      if (!value.trim() && isFocused) {
        error = 'Message is required.';
      }
      break;
    default:
      break;
  }

  return error;
};
