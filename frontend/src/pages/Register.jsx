import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.name.toLowerCase().replace(/\s/g, ''),
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center font-['Poppins'] p-5 bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white rounded-3xl shadow-2xl relative overflow-hidden w-[850px] max-w-full min-h-[550px]">
        
        {/* Register Form */}
        <div className="w-full h-full">
          <form onSubmit={handleSubmit} className="bg-white flex items-center justify-center flex-col p-8 md:p-12 h-full text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-500 text-sm mb-4">Join us and start managing your leads</p>
            
            <div className="flex gap-3 my-5">
              <a href="#" className="border-2 border-gray-200 rounded-full w-11 h-11 flex items-center justify-center text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300">
                <FaFacebookF />
              </a>
              <a href="#" className="border-2 border-gray-200 rounded-full w-11 h-11 flex items-center justify-center text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300">
                <FaGoogle />
              </a>
              <a href="#" className="border-2 border-gray-200 rounded-full w-11 h-11 flex items-center justify-center text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300">
                <FaLinkedinIn />
              </a>
            </div>
            
            <span className="text-sm text-gray-500 mb-4">or use your email for registration</span>
            
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-gray-100 border-2 border-transparent rounded-xl p-3.5 my-2 w-full text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-md transition-all"
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-100 border-2 border-transparent rounded-xl p-3.5 my-2 w-full text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-md transition-all"
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-100 border-2 border-transparent rounded-xl p-3.5 my-2 w-full text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-md transition-all"
            />
            
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-gray-100 border-2 border-transparent rounded-xl p-3.5 my-2 w-full text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-md transition-all"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-12 py-3.5 mt-4 font-semibold text-sm uppercase tracking-wide shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div className="mt-6">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-500 hover:text-purple-600 font-semibold transition">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;