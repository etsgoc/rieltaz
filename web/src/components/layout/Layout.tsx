import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CookieBanner from './CookieBanner';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { scrollTo(0, 0); }, [pathname]);
  return (
    <div className="app">
      <Header />
      <main className="page" key={pathname}><Outlet /></main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
