import React, { useState } from 'react';
import styles from './signin.module.css';
import {Link} from '@remix-run/react';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign-in data:', formData);
  };

  return (
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
          required
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
  );
};

export default SignIn;
