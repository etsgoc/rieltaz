import { Tabs } from 'expo-router';
import { FloatingTabBar } from '@/components/FloatingTabBar';
import { useCatalog } from '@/providers/CatalogProvider';

export default function TabsLayout() {
  const { features } = useCatalog();
  return (
    <Tabs tabBar={props => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="services" options={{ href: features.services ? '/services' : null }} />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
