import React, { useState, useEffect } from 'react';
import styles from './friendList.module.css';  // Import the CSS module
import { Link } from '@remix-run/react';

// Interface for the user data returned by the API
interface User {
  id: number;
}

// Interface for the friend status
interface FriendStatus {
  friend_id: number;
  friend_username: string;
  status: 'pending' | 'accepted' | 'declined';
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
    return { id: data.id }; // Adjust based on your API response
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const FriendList: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [acceptedFriends, setAcceptedFriends] = useState<FriendStatus[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendStatus[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        if (userData) {
          setUserId(userData.id);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/friends?id=${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAcceptedFriends(data);
      } catch (error) {
        setError('Failed to fetch friends. Please try again.');
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchSentRequests = async () => {
      if (!userId) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/friends/sent?id=${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSentRequests(data);
      } catch (error) {
        setError('Failed to fetch sent friend requests. Please try again.');
        console.error('Error fetching sent requests:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReceivedRequests = async () => {
      if (!userId) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/friends/received?id=${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setReceivedRequests(data);
      } catch (error) {
        setError('Failed to fetch received friend requests. Please try again.');
        console.error('Error fetching received requests:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFriends();
      fetchSentRequests();
      fetchReceivedRequests();
    }
  }, [userId]);
  const handleAcceptRequest = async (friendId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/friends/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, friendId })
      });

      if (!response.ok) {
        throw new Error(`Failed to accept request. Status: ${response.status}`);
      }

      // Update UI after accepting
      setReceivedRequests(receivedRequests.map(friend =>
        friend.friend_id === friendId ? { ...friend, status: 'accepted' } : friend
      ));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineRequest = async (friendId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/friends/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, friendId })
      });

      if (!response.ok) {
        throw new Error(`Failed to decline request. Status: ${response.status}`);
      }

      // Update UI after declining
      setReceivedRequests(receivedRequests.map(friend =>
        friend.friend_id === friendId ? { ...friend, status: 'declined' } : friend
      ));
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };
  const handleUnfriend = async (friendId: number) => {
    setLoading(true); // Optional: Set loading state to true while the request is in progress
    try {
      // Make a DELETE request to your backend API to remove the friend
      const response = await fetch(`/api/friends/unfriend/${friendId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Optional: Include token if needed
        }
      });
      
      // Check if the response is okay (status code 2xx)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Optionally update local state or UI to reflect the change
      // For example, you might filter out the unfriended friend from a list
      setAcceptedFriends(prevFriends => prevFriends.filter(friend => friend.friend_id !== friendId));
  
      // Optionally show a success message or notification
      console.log('Successfully unfriended');
    } catch (error) {
      // Handle errors (e.g., show error message)
      console.error('Error unfriending:', error);
    } finally {
      setLoading(false); // Optional: Set loading state to false once the request completes
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Friend Status</h1>
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.friendSection}>
        <h2 className={styles.subheader}>Friends</h2>
        <ul className={styles.friendList}>
          {acceptedFriends.map(friend => (
            <li key={friend.friend_id} className={`${styles.friendItem} ${styles[friend.status]}`}>
              <span>{friend.friend_username}</span>

              <div className={styles.btnContainer}>
                <Link to={`/userProfile/${friend.friend_id}`} className={styles.btnProfile}>
                  Profile
                </Link>
                <button className={styles.Unfriend} onClick={() => handleUnfriend(friend.friend_id)}>
                  Unfriend
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.friendSection}>
        <h2 className={styles.subheader}>Pending Requests</h2>
        <ul className={styles.friendList}>
          {sentRequests.map(friend => (
            <li key={friend.friend_id} className={`${styles.friendItem} ${styles[friend.status]}`}>
              <span>{friend.friend_username}</span>
              <span className={styles.status}>{friend.status}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.friendSection}>
        <h2 className={styles.subheader}>Received Requests</h2>
        <ul className={styles.friendList}>
          {receivedRequests.map(friend => (
            <li key={friend.friend_id} className={`${styles.friendItem} ${styles[friend.status]}`}>
              <span>{friend.friend_username}</span>
              <span className={styles.status}>{friend.status}</span>
              {friend.status === 'pending' && (
                <div className={styles.actions}>
                  <button
                    className={styles.acceptBtn}
                    onClick={() => handleAcceptRequest(friend.friend_id)}
                  >
                    Accept
                  </button>
                  <button
                    className={styles.declineBtn}
                    onClick={() => handleDeclineRequest(friend.friend_id)}
                  >
                    Decline
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendList;
