import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number and 1 special char'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    gender: Yup.string().required('Gender is required'),
    aboutMe: Yup.string().max(500, 'About me should not exceed 500 characters')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      aboutMe: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setSubmitError('');
        
        const { confirmPassword, ...registrationData } = values;
        
        const response = await axios.post('https://localhost:7025/api/Auth/register', registrationData);
        
        if (response.status === 200) {
          setShowSuccess(true);
          
          // Show success message for 3 seconds before redirecting
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                registrationSuccess: true,
                message: 'Registration successful! Please login.' 
              } 
            });
          }, 3000);
        }
      } catch (error) {
        console.error('Registration error:', error);
        setSubmitError(
          error.response?.data?.message || 
          error.response?.data?.errors?.join(', ') || 
          'Registration failed. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Registration successful! Redirecting to login...</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Create an Account</h1>
          <p className="text-center text-gray-600 mb-6">Join our community today</p>
          
          {submitError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{submitError}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  formik.touched.gender && formik.errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.gender}</p>
              )}
            </div>

            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-1">
                About Me
              </label>
              <textarea
                id="aboutMe"
                name="aboutMe"
                rows="3"
                value={formik.values.aboutMe}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  formik.touched.aboutMe && formik.errors.aboutMe ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength="500"
              />
              {formik.touched.aboutMe && formik.errors.aboutMe && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.aboutMe}</p>
              )}
              <p className="text-xs text-gray-500 text-right mt-1">
                {formik.values.aboutMe.length}/500 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formik.isValid}
              className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 ${
                isSubmitting || !formik.isValid ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <RouterLink to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign in
              </RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;