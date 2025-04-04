import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetailsModal = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://localhost:7025/api/Auth/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={onClose}></div>
        </div>

        {/* Modal container */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : user ? (
            <>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 sm:mx-0 sm:h-32 sm:w-32">
                    <span className="text-white text-4xl font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2">
                      {user.name}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Email:</span> {user.email}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Gender:</span> 
                        <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                          {user.gender}
                        </span>
                      </p>
                      {user.phoneNumber && (
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Phone:</span> {user.phoneNumber}
                        </p>
                      )}
                      {user.address && (
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Address:</span> {user.address}
                        </p>
                      )}
                      {user.dateOfBirth && (
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Date of Birth:</span> 
                          {new Date(user.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">About:</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {user.aboutMe || 'No information provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;