import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Legal from './pages/Legal';
import Saved from './pages/Saved';
import NotFound from './pages/NotFound';
import PropertyDetail from './pages/PropertyDetail';
import Properties from './pages/Properties';
import Services from './pages/Services';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:category" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="saved" element={<Saved />} />
        <Route path="legal/:doc" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
