import { Route, Routes } from 'react-router-dom';
import Shell from './components/layout/Shell';
import EmptyState from './components/ui/EmptyState';
import { useIsAdmin } from './lib/useAdmin';
import { useSession } from './providers/SessionProvider';
import Dashboard from './pages/Dashboard';
import Deals from './pages/Deals';
import Listings from './pages/Listings';
import Login from './pages/Login';
import Messages from './pages/Messages';
import Orders from './pages/Orders';
import Settings from './pages/Settings';

export default function App() {
  const { session, ready } = useSession();
  const admin = useIsAdmin();
  if (!ready) return null;
  if (!session) return <Login />;
  if (admin === null) return null;
  if (!admin) return <div className="login"><EmptyState title="This account does not have admin access." /></div>;
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Dashboard />} />
        <Route path="deals" element={<Deals />} />
        <Route path="listings" element={<Listings />} />
        <Route path="orders" element={<Orders />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
