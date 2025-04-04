







import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDetailsModal from '../components/UserDetailsModal ';
import UpdateUserModal from '../components/UpdateUserModal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [notification, setNotification] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://localhost:7025/api/Auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleView = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditClick = (user) => {
    setUserToUpdate(user);
    setShowUpdateModal(true);
  };

  const handleUpdate = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setNotification({
      message: 'User updated successfully',
      type: 'success'
    });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:7025/api/Auth/user/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setNotification({
        message: `${userToDelete.name} has been deleted`,
        type: "success"
      });
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || "Failed to delete user",
        type: "error"
      });
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const closeModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter and pagination logic
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(filter.toLowerCase()) ||
    user.email?.toLowerCase().includes(filter.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-3 text-xl font-bold text-gray-800">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{userToDelete?.name}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={closeModal}
          loading={loadingUserDetails}
        />
      )}

      {/* Update User Modal */}
      {showUpdateModal && userToUpdate && (
        <UpdateUserModal
          user={userToUpdate}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center space-x-2 p-4 rounded-lg shadow-lg animate-fade-in
          ${notification.type === 'success' ? 'bg-emerald-500' : 
            notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white`}>
          {notification.type === 'success' ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">Manage all registered users</p>
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search users..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                          ${user.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium 
                        ${user.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                        {user.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleView(user)}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 sm:mb-0">
            Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to <span className="font-medium">
              {Math.min(indexOfLastUser, filteredUsers.length)}
            </span> of <span className="font-medium">{filteredUsers.length}</span> users
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || filteredUsers.length === 0}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;