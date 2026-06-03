import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Demo credentials
  const demoCredentials = {
    email: 'demo@crm.com',
    password: 'password123'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    toast.success('Demo credentials filled! Click Sign In.', {
      icon: '🔐',
      duration: 3000
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const leftSideVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.2 }
    }
  };

  const rightSideVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.3 }
    }
  };

  const formVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, delay: 0.4 }
    }
  };

  const inputVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({ 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.4, delay: 0.5 + (i * 0.1) }
    })
  };

  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.4, delay: 0.8 }
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const welcomeTextVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, delay: 0.6 }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex justify-center items-center bg-white p-5"
    >
      <motion.div 
        variants={containerVariants}
        className="bg-white rounded-3xl shadow-2xl relative overflow-hidden w-[850px] max-w-full min-h-[550px] border border-gray-200"
      >
        
        {/* Login Form - Left Side */}
        <motion.div 
          variants={leftSideVariants}
          className="absolute left-0 top-0 h-full w-1/2 p-10 flex flex-col justify-center"
        >
          <motion.div variants={formVariants} className="text-center">
            <motion.h1 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-bold text-gray-800 mb-2"
            >
              Sign In
            </motion.h1>
            
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm text-gray-500"
            >
              Sign in to your account
            </motion.span>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5">
              <motion.input
                custom={0}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 mb-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(99,102,241,0.2)" }}
              />
              
              {/* Password Field with Eye Icon */}
              <motion.div
                custom={1}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="relative mb-3"
              >
                <motion.input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(99,102,241,0.2)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-right mb-5"
              >
                <a href="#" className="text-xs text-indigo-500 hover:text-purple-600 transition">Forgot your password?</a>
              </motion.div>
              <motion.button
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full py-3 font-semibold text-sm uppercase tracking-wide shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ⚡
                  </motion.span>
                ) : 'Sign In'}
              </motion.button>
            </form>

            {/* Demo Login Mention */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-4 text-center"
            >
              <p className="text-xs text-gray-500">
                Demo Login:{' '}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-indigo-600 hover:text-purple-600 font-medium underline decoration-dotted underline-offset-2"
                >
                  demo@crm.com / password123
                </button>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Welcome Panel (Purple Gradient) */}
        <motion.div 
          variants={rightSideVariants}
          className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col justify-center items-center p-10 text-center"
        >
          <motion.h1 
            variants={welcomeTextVariants}
            whileHover="hover"
            className="text-3xl font-bold mb-4"
          >
            Hey There!
          </motion.h1>
          <motion.p 
            variants={welcomeTextVariants}
            className="text-lg leading-7 font-medium"
          >
            Welcome to Ganesh CRM Lead Management
          </motion.p>
          
          {/* Animated decorative circles */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-10 left-10 w-20 h-20 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 right-10 w-16 h-16 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-20 w-12 h-12 bg-white/5 rounded-full"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
