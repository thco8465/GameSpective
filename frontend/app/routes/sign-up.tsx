import React from 'react';
import SignUp from '../components/signup/signup'; // Adjust the path if needed
import Title from '../components/Title/title';
import Layout from '../components/layout/layout';
export default function SignUpPage() {
  return (
    <div>
      <Title />
      <Layout>
        <SignUp />
      </Layout>
    </div>
  );
}
