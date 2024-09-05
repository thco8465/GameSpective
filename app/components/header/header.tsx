import { Link } from '@remix-run/react';
import styles from './header.module.css';
export default function Header() {
  return (
    <header>
      <nav className = {styles.items}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-review">Add Review</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/sign-in">Sign In</Link></li>
        </ul>
      </nav>
    </header>
  );
}
