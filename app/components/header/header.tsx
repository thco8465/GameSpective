import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import styles from './header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faHome, faGamepad, faUser, faPlus, faUserCircle, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
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
    navigate('/sign-in'); // Redirect to sign-in page
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
        <li className={styles.navItem}><Link to="/home"><FontAwesomeIcon icon={faHome} className={styles.faIcon} /> Home</Link></li>
          <li className={styles.navItem}><Link to="/reviewByGame"><FontAwesomeIcon icon={faGamepad} className={styles.faIcon} /> Find reviews By game title</Link></li>
          <li className={styles.navItem}><Link to="/reviewByUser"><FontAwesomeIcon icon={faUser} className={styles.faIcon} /> Find reviews By user</Link></li>
          <li className={styles.navItem}><Link to="/add-review"><FontAwesomeIcon icon={faPlus} className={styles.faIcon} /> Add Review</Link></li>
          <li className={styles.navItem}><Link to="/profile"><FontAwesomeIcon icon={faUserCircle} className={styles.faIcon} /> Profile</Link></li>
          <li className={styles.navItem}><Link to="/addFriend"><FontAwesomeIcon icon={faUserPlus} className={styles.faIcon} /> Add Friend</Link></li>
          <li className={styles.navItem}><Link to="/friendlist"><FontAwesomeIcon icon={faUsers} className={styles.faIcon} /> Friend List Status</Link></li>
          {isAuthenticated ? (
            <li className={`${styles.navItem} ${styles.signOutItem}`}>
              <Link to="/sign-in" onClick={handleSignOut} className={styles.signOutLink}>
                <FontAwesomeIcon icon={faSignOutAlt}/>
                Sign Out
              </Link>
            </li>
          ) : (
            <li className={styles.navItem}><Link to="/sign-in">
              <FontAwesomeIcon icon={faSignInAlt} /> Sign In</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
