import React from 'react';
import styles from './profile.module.css';

interface ProfileProps{
    username: string;
    reviewsCount: number;
    level: number;
}
const Profile: React.FC<ProfileProps> = ({username, reviewsCount, level}) => {
    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                <h1 className={styles.username}>{username}</h1>
            </div>
            <div className={styles.profileDetails}>
                <div className={styles.detail}>
                    <span className={styles.label}>Reviews Posted: </span>
                    <span className={styles.value}>{reviewsCount}</span>
                </div>
                <div className={styles.detail}>
                    <span className={styles.label}>Level: </span>
                    <span className={styles.value}>{level}</span>
                </div>
            </div>
        </div>
    );
};

export default Profile;