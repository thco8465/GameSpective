import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import styles from './header.module.css';

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(Boolean(token)); // Update authentication state based on token presence
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setIsAuthenticated(false); // Update authentication state
    navigate('/sign-in'); // Redirect to home or sign-in page
  };

  return (
    <header>
      <h1 className={styles.title}>Gamespective</h1>
      <nav className={styles.items}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-review">Add Review</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          {isAuthenticated ? (
            <li><button onClick={handleSignOut} className={styles.signOutButton}>Sign Out</button></li>
          ) : (
            <li><Link to="/sign-in">Sign In</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
