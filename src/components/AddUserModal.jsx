import React, { useState } from 'react';
import axios from 'axios';

const AddUserModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'Male',
    aboutMe: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ensure no undefined values before sending request
    const formattedData = {
      email: formData.email?.trim() || '',
      name: formData.name?.trim() || '',
      gender: formData.gender || 'Male',
      aboutMe: formData.aboutMe?.trim() || '',
      password: formData.password || '',
    };

    console.log('Sending Data:', JSON.stringify(formattedData)); // Debugging

    try {
      const response = await axios.post(
        'https://localhost:7025/api/Auth/register',
        formattedData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('API Response:', response.data);
      setSuccessMessage(response.data.message || 'User registered successfully!');

      // Clear form and close after 2 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', gender: 'Male', aboutMe: '', password: '' });
        setSuccessMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      setErrorMessage('Failed to register user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-all scale-95 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Add New User</h2>

        {successMessage && (
          <div className="text-green-500 bg-green-100 p-4 rounded-lg text-center mt-4">
            <span className="font-bold">Success! </span>{successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="text-red-500 bg-red-100 p-4 rounded-lg text-center mt-4">
            <span className="font-bold">Error! </span>{errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <textarea
            name="aboutMe"
            placeholder="About Me"
            value={formData.aboutMe}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 text-white rounded-md transition ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Register'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
