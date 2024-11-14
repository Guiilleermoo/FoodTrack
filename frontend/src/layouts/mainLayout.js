import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px' }}><Outlet /></main>
      <Footer />
    </>
  );
};

export default MainLayout;
