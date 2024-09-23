import React, { useState } from 'react';
import FriendSearch from './friendSearch';
import FriendButton from './friendButton';
import styles from './addFriend.module.css'; // Import the CSS module

interface User {
  id: number;
  username: string;
}

function AddFriendPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Find Friends</h1>
      <FriendSearch onUserSelect={setSelectedUser} />
      {selectedUser && <FriendButton selectedUser={selectedUser} />}
    </div>
  );
}

export default AddFriendPage;
