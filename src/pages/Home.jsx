import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddUserModal from '../components/AddUserModal';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await axios.get('https://localhost:7025/api/Auth/validate-token', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const response = await axios.get('https://localhost:7025/api/Auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch user data');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  const handleAddUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://localhost:7025/api/Auth/register', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh user data
      const response = await axios.get('https://localhost:7025/api/Auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
      
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, <span className="text-blue-600">{userData?.name}</span>
          </h1>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New User
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium">Your Name</h3>
            <p className="text-xl font-semibold text-gray-800 mt-1">{userData?.name}</p>
          </div>
         
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium">Gender</h3>
            <p className="text-xl font-semibold text-gray-800 mt-1 capitalize">{userData?.gender}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium">Email</h3>
            <p className="text-xl font-semibold text-gray-800 mt-1">{userData?.email}</p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-2xl font-bold">
                  {userData?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">{userData?.email}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {userData?.aboutMe || "No information provided yet."}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Add User Modal */}
      {showModal && (
        <AddUserModal 
          onClose={() => setShowModal(false)}
          onSubmit={handleAddUser}
        />
      )}

      
    </div>
  );
};

export default Home;
