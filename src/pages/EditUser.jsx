import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    AboutMe: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`/api/auth/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setFormData({
          name: response.data.Name,
          email: response.data.Email,
          gender: response.data.Gender,
          AboutMe: response.data.AboutMe
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user details');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/auth/user/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('User updated successfully!');
      navigate('/userlist');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-user-container">
      <h1>Edit User</h1>
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>About Me:</label>
          <textarea
            name="AboutMe"
            value={formData.AboutMe}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditUser;