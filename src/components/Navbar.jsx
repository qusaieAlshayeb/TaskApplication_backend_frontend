import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const { isAuthenticated, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://localhost:7025/api/Auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Show success message
      setLogoutSuccess(true);
      
      // Clear local auth state
      handleLogout();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'You have been successfully logged out',
            messageType: 'success'
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      handleLogout();
      navigate('/login');
    }
  };

  return (
    <>
      {/* Success Notification */}
      {logoutSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Logout successful! Redirecting to login...</span>
          </div>
        </div>
      )}

      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-800">TaskApp</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition duration-150"
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to="/users" 
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition duration-150"
                  >
                    user info token
                  </Link>
                  <Link 
                    to="/userlist" 
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition duration-150"
                  >
                    Lists
                  </Link>
                </>
              )}
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition duration-150"
              >
                Contact
              </Link>
               <Link 
                to="/UserList" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition duration-150"
              >
                userlist
              </Link>
              {/* Auth Buttons */}
              <div className="flex items-center space-x-4 ml-8">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogoutClick}
                    className="text-indigo-600 hover:text-indigo-800 px-3 py-2 text-sm font-medium transition duration-150"
                  >
                    Logout
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    className="text-indigo-600 hover:text-indigo-800 px-3 py-2 text-sm font-medium transition duration-150"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/users" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                >
                  Users
                </Link>
                <Link 
                  to="/userlist" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                >
                  Lists
                </Link>
              </>
            )}
            <Link 
              to="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              Contact
            </Link>
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center space-x-4 px-5">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-center text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    className="w-full text-center text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;