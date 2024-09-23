import React from 'react';
import FriendList from '../components/friendList/friendList';
import Title from '../components/Title/title';
import Header from '../components/header/header';
import Layout from '../components/layout/layout'
const FriendListPage = () => {
    return (
        <div>
            <Title />
            <Header />
            <Layout>
                <FriendList />
            </Layout>
        </div>
    )
};

export default FriendListPage;