// Layout.tsx
import React from 'react';
import styles from './layout.module.css'; // Custom CSS module for spacing

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className={styles.layoutContainer}>{children}</div>;
};

export default Layout;
