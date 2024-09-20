import React from 'react';
import Friend from '../components/addFriend/addFriend';
import Title from '../components/Title/title';
import Header from '../components/header/header';
import Layout from '../components/layout/layout'
export default function AddFriend(){

    return(
        <div>
            <Title/>
            <Header/>
            <Layout>
                <Friend/>
            </Layout>
        </div>
    )
}