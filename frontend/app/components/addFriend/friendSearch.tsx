import React, { useState } from 'react';
import styles from './friendSearch.module.css';  // Import the CSS module

interface User {
    id: number;
    username: string;
}

interface FriendSearchProps {
    onUserSelect: (user: User) => void;
}

function FriendSearch({ onUserSelect }: FriendSearchProps) {
    const [query, setQuery] = useState<string>('');  // Specify that `query` is a string
    const [results, setResults] = useState<User[]>([]); // Specify that `results` is an array of `User`

    const searchUsers = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/search-user?username=${query}`);
        const data: User[] = await res.json();  // Ensure TypeScript knows the API response type
        setResults(data);
    };

    return (
        <div className={styles.container}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a username"
                className={styles.input}
            />
            <button onClick={searchUsers} className={styles.button}>Search</button>
            <ul className={styles.resultsList}>
                {results.map(user => (
                    <li key={user.id} className={styles.user}>
                        <span className={styles.username}>{user.username}</span>
                        <button className={styles.selectButton} onClick={() => onUserSelect(user)}>Select User</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FriendSearch;
