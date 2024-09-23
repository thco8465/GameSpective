import React from 'react';
import { Link, useNavigate } from '@remix-run/react';

export default function Index() {
  const navigate = useNavigate();
  React.useEffect(() => {
    
    navigate('/sign-in'); // Navigate to /sign-in when the component mounts
  }, [navigate]);

  return null; // Optionally return null or a loading state if needed
}
