



import React from 'react';

const UserDetailsModal = ({ user, onClose, loading }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with subtle animation */}
        <div 
          className="fixed inset-0 transition-opacity duration-300 ease-in-out" 
          aria-hidden="true"
        >
          <div 
            className="absolute inset-0 bg-gradient-to-br from-gray-900 to-blue-900 opacity-75" 
            onClick={onClose}
          ></div>
        </div>

        {/* Modal container with cool transform animation */}
        <div 
          className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
          style={{
            background: 'linear-gradient(to bottom right, #ffffff, #f9fafb)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-600">Loading user details...</p>
            </div>
          ) : (
            <>
              <div className="px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Avatar with gradient based on gender */}
                  <div 
                    className={`mx-auto sm:mx-0 flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-full 
                      ${user?.gender === 'Male' ? 
                        'bg-gradient-to-br from-blue-500 to-indigo-600' : 
                        'bg-gradient-to-br from-pink-500 to-purple-600'} 
                      shadow-lg`}
                  >
                    <span className="text-white text-4xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-900">
                        {user?.name}
                        <span className="ml-2 text-xs font-normal bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          ID: {user?.id}
                        </span>
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">{user?.email}</p>
                    </div>

                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${user?.gender === 'Male' ? 
                          'bg-blue-100 text-blue-800' : 
                          'bg-pink-100 text-pink-800'}`}
                      >
                        {user?.gender}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        About
                      </h4>
                      <p className="mt-1 text-gray-700">
                        {user?.aboutMe || 'No information provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with glass effect */}
              <div 
                className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-base font-medium text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;