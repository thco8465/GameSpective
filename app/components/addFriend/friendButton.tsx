import React, {useState, useEffect } from 'react';

interface User{
    id: number;
    username: string;
}
interface FriendButtonProps {
    selectedUser: User;
  }
const fetchUserData = async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      // Extract the fields you need
      const { id,username } = data;
      return { id,username };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
};
function FriendButton({ selectedUser }: FriendButtonProps) {
    const [id, setId] = useState<number | null>(null);
    const [username,setUsername] = useState<string | null>(null);
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        if (userData) {
          setId(userData.id);
          setUsername(userData.username);
        }
      } catch (error) {
        console.error('Error loading user data: ', error);
      }
    };
    loadUserData();
  }, []);
  const sendFriendRequest = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/add-friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: id,
          friendId: selectedUser.id
        })
      });
  
      if (!response.ok) {
        // Handle HTTP errors
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Optionally, you could handle the response here
      const result = await response.json();
      console.log('Server response:', result);
  
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request. Please try again.');
    }
  };
  

    return (
        <div>
            <h3>{selectedUser.username}</h3>
            <button onClick={sendFriendRequest}>Add Friend</button>
        </div>
    );
}
export default FriendButton;
