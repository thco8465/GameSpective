import React from 'react';
import SignIn from '../components/signin/signin'; // Adjust the path if needed
import Title from '../components/Title/title';
import Layout from '~/components/layout/layout';
export default function SignInPage() {
  return (
    <div>
      <Title />
      <Layout>
        <SignIn />
      </Layout>
    </div>
  );
}
