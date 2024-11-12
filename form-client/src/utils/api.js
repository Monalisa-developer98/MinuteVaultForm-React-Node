import axios from 'axios';

export const requestOtp = async (name, email) => {
  try {
    console.log(process.env)
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/request-otp`, { name, email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Server error' };
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Server error' };
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/create-user`, userData);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating user');
  }
};