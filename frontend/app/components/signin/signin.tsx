import React, { useState } from 'react';
import styles from './signin.module.css';
import { Link, useNavigate } from '@remix-run/react';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const navigate = useNavigate(); // useNavigate hook for redirecting

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit button clicked'); // Add this line
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/authRoutes/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store token
        console.log('Sign-in successful:', data);
        navigate('/home');
        // Handle successful sign-in (e.g., redirect or store token)
      } else {
        console.error('Sign-in failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={styles.input}
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Sign In
          </button>
        </form>
        <p className={styles.prompt}>Don't have an account?</p>
        <div className={styles.signUpPrompt}>
          <Link to="/sign-up" className={styles.signUpButton}>
            Sign Up Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
